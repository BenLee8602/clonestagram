require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected to database"))
.catch(err => console.log("Failed to connect to database: " + err));

const User = require("./src/models/user");
const Post = require("./src/models/post");

const usersRouter = require("./src/routes/users");
const postsRouter = require("./src/routes/posts");
const commentsRouter = require("./src/routes/comments");
const repliesRouter = require("./src/routes/replies");

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/replies", repliesRouter);


app.get("/search/:query", async (req, res) => {
    const query = { $regex: req.params.query, $options: "i" };
    try {
        const users = await User.find({ name: query }, "-_id -pass");
        const posts = await Post.find({ $or: [{ author: query }, { caption: query }] });
        res.json({ query: req.params.query, users, posts });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.listen(port, () => {
    console.log(`backend running on port ${port}`);
});
