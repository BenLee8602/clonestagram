const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));

const mongoose = require("mongoose");
const database = require("./config/database");
mongoose.connect(database.url)
.then(() => console.log("Connected to database"))
.catch(err => console.log("Failed to connect to database: " + err));

const User = require("./models/user");
const Post = require("./models/post");

const bcrypt = require("bcrypt");



app.post("/register", async (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    
    try {
        const doc = await User.findOne({ name: name }, "-_id name");
        if (doc) return res.json({ success: false, msg: "Username is taken" });

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({ name, pass: hash });
        await user.save();
        res.json({ success: true, msg: `User ${name} created` });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.post("/login", async (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;

    try {
        const user = await User.findOne({ name: name });
        if (user) {
            if (await bcrypt.compare(pass, user.pass))
                res.json({ success: true, msg: `Logged in as ${name}` });
            else res.json({ success: false, msg: `Incorrect password` });
        }
        else res.json({ success: false, msg: `User ${name} not found` });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ posted: "desc" });
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.get("/users/:name/profile", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name }, "-_id name");
        if (!user) return res.json({ success: false, posts: [] });
        const posts = await Post.find({ author: req.params.name }).sort({ posted: "desc" });;
        res.json({ success: true, posts: posts });
    } catch (err) {
        console.log(err);
        res.json({success: false, err: err });
    }
});


app.get("/search/:query", async (req, res) => {
    const query = { $regex: req.params.query, $options: "i" }
    try {
        const users = await User.find({ name:  query }, "-_id name");
        const posts = await Post.find({ title: query });
        res.json({ query: req.params.query, users, posts });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.post("/newpost", async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        await newPost.save();
        res.json({ success: true, msg: "New post added" });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.listen(port, () => {
    console.log(`backend running on port ${port}`);
});
