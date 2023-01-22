const express = require("express");

const { requireLogin } = require("../middlewares/auth");


function getRepliesRouter(db) {
    const router = express.Router();


    // get replies for a comment
    router.get("/:id", async (req, res) => {
        try {
            const replies = await db.replies.find({ parent: req.params.id });
            res.status(200).json(replies);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // reply to a comment
    router.post("/:id", requireLogin, async (req, res) => {
        try {
            const comment = db.comments.findOne({ _id: req.params.id });
            if (!comment) return res.status(404).json("comment not found");

            const reply = await db.replies.create({
                parent: req.params.id,
                author: req.user,
                text: req.body.text,
            });
            await reply.save();

            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // like a reply
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const reply = await db.replies.findOne({ _id: req.params.id });
            if (!reply) return res.status(404).json("reply not found");
            
            const liked = reply.likes.includes(req.user);
            if (liked) reply.likes = reply.likes.filter(e => e !== req.user);
            else reply.likes.push(req.user);

            await db.replies.updateOne(
                { _id: req.params.id },
                { $set: { likes: reply.likes } }
            );
            
            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a reply
    router.put("/:id", requireLogin, async (req, res) => {
        try {
            const reply = await db.replies.findOneAndUpdate(
                { _id: req.params.id, author: req.user },
                { $set: { text: req.body.text } },
                { new: true }
            );
            if (!reply) return res.status(404).json("reply not found");
            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete a reply
    router.delete("/:id", requireLogin, async (req, res) => {
        try {
            const reply = await db.replies.findOneAndDelete({ _id: req.params.id, author: req.user });
            if (!reply) return res.status(404).json("reply not found");
            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getRepliesRouter;

