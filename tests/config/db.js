
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const Post    = require("../../src/models/post");
const Token   = require("../../src/models/token");
const User    = require("../../src/models/user");
const Comment = require("../../src/models/comment");

const testData = require("./testdata");

const jwt = require("jsonwebtoken");

const pageSize = 2;


async function start() {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri());
}

async function stop() {
    await mongoose.disconnect();
    await mongodb.stop();
}


async function resetData() {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    await User.insertMany(testData.users);
    await Token.insertMany(testData.tokens);
    await Post.insertMany(testData.posts);
    await Comment.insertMany(testData.comments);
}


function genTestAccessToken(user) {
    return jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET
    );
}


module.exports = {
    objectId: (id) => new mongoose.Types.ObjectId(id),
    posts: Post,
    tokens: Token,
    users: User,
    comments: Comment,
    pageSize,

    start,
    stop,

    resetData,
    genTestAccessToken
};
