const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Post = require("../models/post");

const { verifyToken } = require("../middleware/authorize");


// get all posts (feed)
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ posted: "desc" });
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


// create new post
router.post("/", verifyToken, async (req, res) => {
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


// get a post by id
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) res.json({ success: true, post: post });
        else res.json({ success: false, msg: "post not found" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: err });
    }
});


// like a post
router.put("/:id/like", verifyToken, async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            [{ $set: {
                likes: {
                    $cond: {
                        if: { $in: [req.user, "$likes"] },
                        then: { $setDifference: ["$likes", [req.user]] },
                        else: { $concatArrays:  ["$likes", [req.user]] }
                    }
                }
            } }],
            { new: true }
        );

        res.json({ likes: post.likes });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// comment on a post
router.post("/:id/comment", verifyToken, async (req, res) => {
    try {
        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            author: req.user,
            posted: Date.now(),
            text: req.body.comment,
            likes: [],
            replies: []
        };

        await Post.updateOne(
            { _id: req.params.id },
            { $push: { comments: newComment } }
        );
        res.json({ success: true, comment: newComment });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// edit a post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.updateOne(
            { _id: req.params.id, author: req.user },
            { $set: { caption: req.body.caption } }
        );
        res.json({ success: !!post });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});


// delete a post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.deleteOne(
            { _id: req.params.id, author: req.user },
        );
        res.json({ success: !!post });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});


module.exports = router;
