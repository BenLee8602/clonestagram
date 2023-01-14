const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Post = require("../models/post");

const { verifyToken } = require("../middleware/authorize");


// get all posts (feed)
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ posted: "desc" });
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
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
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// get a post by id
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) res.status(200).json(post);
        else res.status(404).json("post not found");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
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

        res.status(200).json(post.likes);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
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
        res.status(200).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// edit a post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.updateOne(
            { _id: req.params.id, author: req.user },
            { $set: { caption: req.body.caption } }
        );
        if (post) res.status(200).json(req.body.caption);
        else res.status(400).json(req.body.caption);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// delete a post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.deleteOne(
            { _id: req.params.id, author: req.user },
        );
        if (post) res.status(200).json(req.params.id);
        else res.status(400).json(req.params.id);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;
