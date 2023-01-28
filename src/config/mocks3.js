const crypto = require("crypto");

const defaultImages = {
    "bensProfilePicture": "linkToBensProfilePicture",
    "post1Image": "linkToPost1Image",
    "post2Image": "linkToPost2Image"
};

var images = { ...defaultImages };

function resetImages() {
    images = { ...defaultImages };
}

function generateImageName() {
    return crypto.randomBytes(32).toString("hex");
}

function getImage(imageName) {
    if (!imageName) return "";
    return images[imageName];
}

function putImage(imageName, imageBuffer, contentType) {
    images[imageName] = imageBuffer.toString();
}

function deleteImage(imageName) {
    delete images[imageName];
}

module.exports = {
    defaultImages,
    images,
    resetImages,
    generateImageName,
    getImage,
    putImage,
    deleteImage
};
