import path from 'path'
import { NextResponse } from 'next/server'
import { transcodeVideo } from '@/lib/transcode'


export async function POST(req) {
    try {
        const { fileName } = await req.json()

        if (!fileName) {
            return NextResponse.json(
                { error: 'fileName is required' },
                { status: 400 },
            )
        }

        const inputFile = path.join(process.cwd(), 'videos', fileName)
        const outputDir = path.join(process.cwd(), 'tmp', 'hls')
        const bucketName = process.env.AWS_S3_BUCKET

        const masterUrl = await transcodeVideo(inputFile, outputDir, bucketName)

        return NextResponse.json({ success: true, masterUrl })
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        )
    }
}
