const express = require("express");

const { requireLogin } = require("../middlewares/auth");


function getCommentsRouter(db) {
    const router = express.Router();


    // get comments for a post
    router.get("/:id", async (req, res) => {
        try {
            const comments = await db.comments.find({ parent: req.params.id });
            res.status(200).json(comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // create comment
    router.post("/:id", requireLogin, async (req, res) => {
        try {
            const post = await db.posts.findOne({ _id: req.params.id });
            if (!post) return res.status(404).json("post not found");

            const comment = await db.comments.create({
                parent: req.params.id,
                author: req.user,
                text: req.body.text,
            });
            await comment.save();
            
            res.status(200).json(comment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // like a comment
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const comment = await db.comments.findOne({ _id: req.params.id });
            if (!comment) return res.status(404).json("comment not found");
            
            const liked = comment.likes.includes(req.user);
            if (liked) comment.likes = comment.likes.filter(e => e !== req.user);
            else comment.likes.push(req.user);

            await db.comments.updateOne(
                { _id: req.params.id },
                { $set: { likes: comment.likes } }
            );
            
            res.status(200).json(comment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a comment
    router.put("/:id", requireLogin, async (req, res) => {
        try {
            const comment = await db.comments.findOneAndUpdate(
                { _id: req.params.id, author: req.user },
                { $set: { text: req.body.text } },
                { new: true }
            );
            if (!comment) return res.status(404).json("comment not found");
            res.status(200).json(comment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete comment
    router.delete("/:id", requireLogin, async (req, res) => {
        try {
            const comment = await db.comments.findOneAndDelete({ _id: req.params.id, author: req.user });
            if (!comment) return res.status(404).json("comment not found");
            res.status(200).json(comment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getCommentsRouter;
