const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected to database"))
.catch(err => console.log("Failed to connect to database: " + err));

const Post  = require("../models/post");
const Token = require("../models/token");
const User  = require("../models/user");

module.exports = {
    objectId: (id) => new mongoose.Types.ObjectId(id),
    posts: Post,
    tokens: Token,
    users: User
};
