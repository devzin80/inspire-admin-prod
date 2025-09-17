import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { rimraf } from 'rimraf'

// --- AWS v3 client ---
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

const BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET

// --- Upload file to S3 with Content-Type and retry ---
async function uploadToS3(filePath, key, retries = 3) {
    const fileStream = fs.createReadStream(filePath)
    const ext = path.extname(key).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.m3u8') contentType = 'application/x-mpegURL'
    else if (ext === '.ts') contentType = 'video/MP2T'

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: BUCKET,
            Key: key,
            Body: fileStream,
            ContentType: contentType,
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
    })

    upload.on('httpUploadProgress', (p) => {
        if (p.total) {
            process.stdout.write(
                `Uploading ${key}: ${((p.loaded / p.total) * 100).toFixed(
                    1,
                )}%\r`,
            )
        }
    })

    try {
        await upload.done()
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying upload ${key}...`)
            return uploadToS3(filePath, key, retries - 1)
        } else throw err
    }

    console.log(`\n✅ Uploaded: ${key}`)
    return `https://${BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
}

// --- Generate HLS playlist with actual segment durations ---
function createResolutionPlaylistContent(segmentUrls, durations) {
    let content = '#EXTM3U\n#EXT-X-VERSION:3\n'
    content += '#EXT-X-MEDIA-SEQUENCE:0\n'
    content += `#EXT-X-TARGETDURATION:${Math.ceil(Math.max(...durations))}\n`
    segmentUrls.forEach((url, idx) => {
        content += `#EXTINF:${durations[idx]},\n${url}\n`
    })
    content += '#EXT-X-ENDLIST'
    return content
}

// --- Main Transcode Function ---
export const transcodeVideo = async (
    inputFile,
    outputDir,
    generateThumbnails = false,
) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
    const baseName = path.basename(inputFile, path.extname(inputFile))
    const safeInputFile = inputFile.replace(/\\/g, '/')

    const resolutions = [
        {
            name: '480p',
            width: 854,
            height: 480,
            vBitrate: '1500k',
            aBitrate: '128k',
        },
        {
            name: '720p',
            width: 1280,
            height: 720,
            vBitrate: '3000k',
            aBitrate: '128k',
        },
        {
            name: '1080p',
            width: 1920,
            height: 1080,
            vBitrate: '5000k',
            aBitrate: '192k',
        },
    ]

    const resolutionUrls = {}

    for (const { name, width, height, vBitrate, aBitrate } of resolutions) {
        const playlistFile = path
            .join(outputDir, `${baseName}_${name}.m3u8`)
            .replace(/\\/g, '/')
        const segmentPattern = path
            .join(outputDir, `${baseName}_${name}_%03d.ts`)
            .replace(/\\/g, '/')

        console.log(`🎥 Transcoding ${name}...`)

        // --- Transcode with HLS ---
        await new Promise((resolve, reject) => {
            ffmpeg(safeInputFile)
                .outputOptions([
                    '-vf',
                    `scale=${width}:${height}`,
                    '-c:v',
                    'h264',
                    '-b:v',
                    vBitrate,
                    '-c:a',
                    'aac',
                    '-b:a',
                    aBitrate,
                    '-ac',
                    '2',
                    '-f',
                    'hls',
                    '-hls_time',
                    '10',
                    '-hls_list_size',
                    '0',
                    '-hls_segment_filename',
                    segmentPattern,
                ])
                .on('start', (cmd) => console.log('FFmpeg command:', cmd))
                .on('end', resolve)
                .on('error', reject)
                .save(playlistFile)
        })

        // --- Upload segments and gather URLs & durations ---
        const segmentFiles = fs
            .readdirSync(outputDir)
            .filter(
                (f) =>
                    f.startsWith(`${baseName}_${name}_`) && f.endsWith('.ts'),
            )
        const segmentUrls = []
        const durations = []

        for (const segFile of segmentFiles) {
            const segPath = path.join(outputDir, segFile)
            segmentUrls.push(await uploadToS3(segPath, segFile))
            // Get duration using ffprobe
            const ffprobeData = await new Promise((res, rej) =>
                ffmpeg.ffprobe(segPath, (err, data) =>
                    err ? rej(err) : res(data),
                ),
            )
            durations.push(ffprobeData.format.duration)
        }

        // --- Create and upload resolution playlist with absolute URLs ---
        const playlistContent = createResolutionPlaylistContent(
            segmentUrls,
            durations,
        )
        fs.writeFileSync(playlistFile, playlistContent)
        resolutionUrls[name] = await uploadToS3(
            playlistFile,
            path.basename(playlistFile),
        )
    }

    // --- Master playlist ---
    const masterLines = ['#EXTM3U', '#EXT-X-VERSION:3']
    for (const { name, width, height, vBitrate } of resolutions) {
        masterLines.push(
            `#EXT-X-STREAM-INF:BANDWIDTH=${
                parseInt(vBitrate) * 1000
            },RESOLUTION=${width}x${height}`,
        )
        masterLines.push(resolutionUrls[name])
    }
    const masterContent = masterLines.join('\n')
    const masterPath = path.join(outputDir, `${baseName}_master.m3u8`)
    fs.writeFileSync(masterPath, masterContent)
    const masterUrl = await uploadToS3(masterPath, `${baseName}_master.m3u8`)

    // --- Optional: generate a thumbnail ---
    if (generateThumbnails) {
        const thumbPath = path.join(outputDir, `${baseName}_thumb.jpg`)
        await new Promise((resolve, reject) => {
            ffmpeg(safeInputFile)
                .screenshots({
                    timestamps: ['50%'],
                    filename: thumbPath,
                    folder: outputDir,
                    size: '320x180',
                })
                .on('end', resolve)
                .on('error', reject)
        })
        await uploadToS3(thumbPath, path.basename(thumbPath))
    }

    // --- Delete local folder ---
    try {
        await rimraf(outputDir)
        console.log(`🗑️ Deleted local folder: ${outputDir}`)
    } catch (err) {
        console.error('Failed to delete local folder:', err)
    }

    return masterUrl
}


