const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    parent: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true
    },
    parentType: {
        type: String,
        required: true,
        immutable: true
    },
    author: {
        type: String,
        required: true,
        immutable: true
    },
    posted: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    text: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("comment", CommentSchema, "comments");
