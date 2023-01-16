require("dotenv").config();

const path = require("path");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("client/build"));

const cors = require("cors");
app.use(cors({ origin: "*" }));

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected to database"))
.catch(err => console.log("Failed to connect to database: " + err));

const { s3client, getImageUrl } = require("./src/utils/s3");

const User = require("./src/models/user");
const Post = require("./src/models/post");

const usersRouter = require("./src/routes/users");
const postsRouter = require("./src/routes/posts");
const commentsRouter = require("./src/routes/comments");
const repliesRouter = require("./src/routes/replies");

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/replies", repliesRouter);


app.get("/api/search/:query", async (req, res) => {
    const query = { $regex: req.params.query, $options: "i" };
    try {
        const users = await User.find({ name: query }, "-_id -pass");
        for (let i = 0; i < users.length; ++i) users[i].pfp = await getImageUrl(users[i].pfp);

        const posts = await Post.find({ $or: [{ author: query }, { caption: query }] });
        for (let i = 0; i < posts.length; ++i) posts[i].image = await getImageUrl(posts[i].image);

        res.status(200).json({ query: req.params.query, users, posts });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});


app.listen(port, () => {
    console.log(`backend running on port ${port}`);
});
