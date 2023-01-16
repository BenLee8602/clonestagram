const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3client, getImageUrl, generateImageName } = require("../utils/s3");

const Post = require("../models/post");

const { verifyToken } = require("../middlewares/authorize");


// get all posts (feed)
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ posted: "desc" });
        for (let i = 0; i < posts.length; ++i)
            posts[i].image = await getImageUrl(posts[i].image);
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// create new post
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const imageName = generateImageName();

        // upload image to s3
        await s3client.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }));

        // upload info to database
        const newPost = await Post.create({
            author: req.user,
            image: imageName,
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
        if (!post) return res.status(404).json("post not found");
        post.image = await getImageUrl(post.image);
        res.status(200).json(post);
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
        const post = await Post.findOneAndDelete(
            { _id: req.params.id, author: req.user },
        );
        if (!post) res.status(404).json(req.params.id);

        await s3client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: post.image
        }));

        res.status(200).json(req.params.id);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;
