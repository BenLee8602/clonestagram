const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        default: "/default_pfp.png"
    },
    nick: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("user", UserSchema, "users");
