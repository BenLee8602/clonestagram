const express = require("express");

const { requireLogin } = require("../middlewares/auth");


function getCommentsRouter(db) {
    const router = express.Router();


    // like a comment
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const post = await db.posts.findOne(
                { "comments._id": id },
                "comments.$"
            );
            if (!post) return res.status(404).json("comment not found");
            
            const liked = post.comments[0].likes.includes(req.user);
            if (liked) post.comments[0].likes = post.comments[0].likes.filter(e => e !== req.user);
            else post.comments[0].likes.push(req.user);

            const newPost = await db.posts.findOneAndUpdate(
                { "comments._id": id },
                { $set: { "comments.$.likes": post.comments[0].likes } },
                { new: true }
            );
            
            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // reply to a comment
    router.post("/:id/reply", requireLogin, async (req, res) => {
        try {
            const newReply = {
                _id: db.objectId(),
                author: req.user,
                posted: Date.now(),
                text: req.body.reply,
                likes: []
            };

            const id = db.objectId(req.params.id);
            const newPost = await db.posts.findOneAndUpdate(
                { "comments._id": id },
                { $push: { "comments.$.replies": newReply } },
                { new : true }
            );
            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a comment
    router.put("/:id", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const newPost = await db.posts.findOneAndUpdate(
                { comments: { $elemMatch: { _id: id, author: req.user } } },
                { $set: { "comments.$.text": req.body.text } },
                { new: true }
            );
            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete comment
    router.delete("/:id", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const newPost = await db.posts.findOneAndUpdate(
                { comments: { $elemMatch: { _id: id, author: req.user } } },
                { $pull: { comments: { _id: id } } },
                { new: true }
            );
            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getCommentsRouter;
