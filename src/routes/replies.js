const express = require("express");

const { requireLogin } = require("../middlewares/auth");


function getRepliesRouter(db) {
    const router = express.Router();


    // like a reply
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const post = await db.posts.findOne(
                { "comments.replies._id": id },
                "comments.$"
            );
            if (!post) return res.status(404).json("reply not found");
            
            const i = post.comments[0].replies.map(r => r._id.toString()).indexOf(id.toString());
            
            const liked = post.comments[0].replies[i].likes.includes(req.user);
            if (liked) post.comments[0].replies[i].likes = post.comments[0].replies[i].likes.filter(e => e !== req.user);
            else post.comments[0].replies[i].likes.push(req.user);
            
            const newPost = await db.posts.findOneAndUpdate(
                { "comments.replies._id": id },
                { $set: { "comments.$.replies": post.comments[0].replies } },
                { new: true }
            );

            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a reply
    router.put("/:id", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const post = await db.posts.findOne(
                { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
                "comments.$"
            );
            if (!post) return res.json({ success: false, msg: "reply not found" });
            
            const i = post.comments[0].replies.map(r => r._id.toString()).indexOf(id.toString());

            post.comments[0].replies[i].text = req.body.text;

            const newPost = await db.posts.findOneAndUpdate(
                { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
                { $set: { "comments.$.replies": post.comments[0].replies } },
                { new: true }
            );

            res.status(200).json(newPost.comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete a reply
    router.delete("/:id", requireLogin, async (req, res) => {
        try {
            const id = db.objectId(req.params.id);
            const newPost = await db.posts.findOneAndUpdate(
                { "comments.replies": { $elemMatch: { _id: id, author: req.user } } },
                { $pull: { "comments.$.replies": { _id: id } } },
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


module.exports = getRepliesRouter;

