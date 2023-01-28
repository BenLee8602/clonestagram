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


    // create reply
    router.post("/:id", requireLogin, async (req, res) => {
        const text = req.body.text;
        if (!text) return res.status(400).send("missing reply text");
        try {
            const comment = await db.comments.findById(req.params.id);
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


    // like reply
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const reply = await db.replies.findOneAndUpdate(
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
            
            if (!reply) return res.status(404).json("reply not found");
            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit reply
    router.put("/:id", requireLogin, async (req, res) => {
        const text = req.body.text;
        if (!text) return res.status(400).send("new text missing");
        try {
            const reply = await db.replies.findOneAndUpdate(
                { _id: req.params.id, author: req.user },
                { $set: { text: text } },
                { new: true }
            );
            if (!reply) return res.status(404).json("reply not found");
            res.status(200).json(reply);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete reply
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

