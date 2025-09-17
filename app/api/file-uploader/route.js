import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

export async function POST(req) {
    try {
        const formData = await req.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 },
            )
        }

        // Convert to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const key = `${Date.now()}-${file.name}`

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
           
        }

        await s3.send(new PutObjectCommand(params))

        const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
