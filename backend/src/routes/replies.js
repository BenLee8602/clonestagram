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
        
        await Post.updateOne(
            { "comments.replies._id": id },
            { $set: { "comments.$.replies": post.comments[0].replies } }
        );
        res.json({ success: true, likes: post.comments[0].replies[i].likes, idx: i });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// edit a reply
router.put("/:id/edit", verifyToken, async (req, res) => {
    
});


module.exports = router;
