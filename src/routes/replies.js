const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Post = require("../models/post");

const { verifyToken } = require("../middleware/authorize");


// like a reply
router.put("/:id/like", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await Post.findOne(
            { "comments.replies._id": id },
            "comments.$"
        );
        if (!post) return res.json({ success: false, msg: "reply not found" });
        
        const i = post.comments[0].replies.map(r => r._id.toString()).indexOf(id.toString());
        
        const liked = post.comments[0].replies[i].likes.includes(req.user);
        if (liked) post.comments[0].replies[i].likes = post.comments[0].replies[i].likes.filter(e => e !== req.user);
        else post.comments[0].replies[i].likes.push(req.user);
        
        const newPost = await Post.findOneAndUpdate(
            { "comments.replies._id": id },
            { $set: { "comments.$.replies": post.comments[0].replies } },
            { new: true }
        );

        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// edit a reply
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await Post.findOne(
            { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
            "comments.$"
        );
        if (!post) return res.json({ success: false, msg: "reply not found" });
        
        const i = post.comments[0].replies.map(r => r._id.toString()).indexOf(id.toString());

        post.comments[0].replies[i].text = req.body.text;

        const newPost = await Post.findOneAndUpdate(
            { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
            { $set: { "comments.$.replies": post.comments[0].replies } },
            { new: true }
        );

        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// delete a reply
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const newPost = await Post.findOneAndUpdate(
            { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
            { $pull: { "comments.$.replies": { _id: id } } },
            { new: true }
        );
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;
