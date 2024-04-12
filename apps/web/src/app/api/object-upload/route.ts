import AWS from 'aws-sdk';
import sharp from 'sharp';
import multer from 'multer';

const bucketName = 'ziphus';

const s3 = new AWS.S3({
    accessKeyId: process.env.C2_OBJECT_STORAGE_STORAGE_KEY,
    secretAccessKey: process.env.C2_OBJECT_STORAGE_PRIVATE_KEY,
    endpoint: process.env.C2_OBJECT_STORAGE_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    if (!image) {
        return new Response(JSON.stringify({ error: 'No image uploaded.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const buffer = Buffer.from(await image.arrayBuffer());

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    try {
        const data = await s3.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ACL: 'public-read',
            ContentType: 'image/png',
        }).promise();
        console.log(data);
        return new Response(JSON.stringify({ message: 'File uploaded successfully', url: data.Location }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
