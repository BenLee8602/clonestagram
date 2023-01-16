const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const crypto = require("crypto");


const s3client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


async function getImageUrl(imageName, expiresIn) {
    if (!imageName) return "";
    return await getSignedUrl(
        s3client,
        new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName
        }),
        { expiresIn: expiresIn }
    );
}


function generateImageName() {
    return crypto.randomBytes(32).toString("hex");
}


module.exports = { s3client, getImageUrl, generateImageName };
