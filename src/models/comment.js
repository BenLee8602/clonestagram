const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    parent: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("comment", CommentSchema, "comments");
