const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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
    image: {
        type: String,
        default: "/default_pfp.png"
    },
    caption: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("post", PostSchema, "posts");
