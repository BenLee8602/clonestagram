const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("token", TokenSchema, "tokens");
