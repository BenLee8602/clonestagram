const mongoose = require("mongoose");

const Post  = require("../models/post");
const Token = require("../models/token");
const User  = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
    objectId: (id) => new mongoose.Types.ObjectId(id),
    posts: Post,
    tokens: Token,
    users: User,
    comments: Comment
};
