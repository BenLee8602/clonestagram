const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Post = require("../models/post");

const { verifyToken } = require("../middleware/authorize");


// like a comment
router.put("/:id/like", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await Post.findOne(
            { "comments._id": id },
            "comments.$"
        );
        if (!post) return res.json({ success: false, msg: "comment not found" });
        
        const liked = post.comments[0].likes.includes(req.user);
        if (liked) post.comments[0].likes = post.comments[0].likes.filter(e => e !== req.user);
        else post.comments[0].likes.push(req.user);

        const newPost = await Post.findOneAndUpdate(
            { "comments._id": id },
            { $set: { "comments.$.likes": post.comments[0].likes } },
            { new: true }
        );
        
        res.json({ success: true, newPost });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// reply to a comment
router.post("/:id/reply", verifyToken, async (req, res) => {
    try {
        const newReply = {
            _id: new mongoose.Types.ObjectId(),
            author: req.user,
            posted: Date.now(),
            text: req.body.reply,
            likes: []
        };

        const id = new mongoose.Types.ObjectId(req.params.id);
        const newPost = await Post.findOneAndUpdate(
            { "comments._id": id },
            { $push: { "comments.$.replies": newReply } },
            { new : true }
        );
        res.json({ success: true, newPost });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// edit a comment
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const newPost = await Post.findOneAndUpdate(
            { comments: { $elemMatch: { _id: id, author: req.user } } },
            { $set: { "comments.$.text": req.body.text } },
            { new: true }
        );
        res.json({ success: true, newPost });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});


// delete comment
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const newPost = await Post.findOneAndUpdate(
            { comments: { $elemMatch: { _id: id, author: req.user } } },
            { $pull: { comments: { _id: id } } },
            { new: true }
        );
        res.json({ success: true, newPost });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});


module.exports = router;
