const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const crypto = require("crypto");


const s3client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


function generateImageName() {
    return crypto.randomBytes(32).toString("hex");
}


const imageUrlLifetime = 600;

async function getImage(imageName) {
    if (!imageName) return "";
    return await getSignedUrl(
        s3client,
        new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName
        }),
        { expiresIn: imageUrlLifetime }
    );
}


async function putImage(imageName, imageBuffer, contentType) {
    await s3client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: imageBuffer,
        ContentType: contentType
    }));
}


async function deleteImage(imageName) {
    await s3client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName
    }));
}


module.exports = {
    generateImageName,
    getImage,
    putImage,
    deleteImage
};
