const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    created: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    follower: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true
    },
    following: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true
    }
});

module.exports = mongoose.model("follow", FollowSchema, "follows");
