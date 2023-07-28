const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    created: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    target: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true
    },
    likedBy: {
        type: String,
        required: true,
        immutable: true
    }
});

module.exports = mongoose.model("like", LikeSchema, "likes");
