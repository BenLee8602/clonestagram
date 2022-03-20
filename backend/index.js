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

const User = require("./models/user");
const Post = require("./models/post");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
    const token = req.headers["authorization"].split(' ')[1];
    if (!token) return res.status(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403);
        req.user = user;
        next();
    });
}


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

        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);

        res.json({ success: true, msg: `User ${name} created`, token: token });
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
            if (await bcrypt.compare(pass, user.pass)) {
                const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);
                res.json({ success: true, msg: `Logged in as ${name}`, token: token });
            }
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
        const user = await User.findOne({ name: req.params.name }, "-_id -pass");
        if (!user) return res.json({ success: false, posts: [] });
        const posts = await Post.find({ author: req.params.name }).sort({ posted: "desc" });;
        res.json({ success: true, user: user, posts: posts });
    } catch (err) {
        console.log(err);
        res.json({success: false, err: err });
    }
});


app.get("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) res.json({ success: true, post: post });
        else res.json({ success: false });
    } catch (err) {
        console.log(err);
        res.json({success: false, err: err });
    }
});


app.get("/search/:query", async (req, res) => {
    const query = { $regex: req.params.query, $options: "i" }
    try {
        const users = await User.find({ name: query }, "-_id -pass");
        const posts = await Post.find({ $or: [{ author: query }, { caption: query }] });
        res.json({ query: req.params.query, users, posts });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.post("/newpost", verifyToken, async (req, res) => {
    try {
        const newPost = await Post.create({
            author: req.user,
            image: req.body.image,
            caption: req.body.caption
        });
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
