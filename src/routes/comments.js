const express = require("express");

const { requireLogin } = require("../middlewares/auth");
const { getPageInfo } = require("../middlewares/page");


function getCommentsRouter(db) {
    const router = express.Router();


    // get comments
    router.get("/:parent", getPageInfo, async (req, res) => {
        try {
            const comments = await db.comments.find({
                parent: req.params.parent,
                posted: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            }).sort({ posted: "desc" });

            res.status(200).json(comments);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // create comment
    router.post("/:parent", requireLogin, async (req, res) => {
        const text = req.body.text;
        if (!text) return res.status(400).json("missing comment");
        try {
            const comment = await db.comments.create({
                parent: req.params.parent,
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


    // like comment
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const comment = await db.comments.findOneAndUpdate(
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
            
            if (!comment) return res.status(404).json("comment not found");
            res.status(200).json(comment.likes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit comment
    router.put("/:id", requireLogin, async (req, res) => {
        const text = req.body.text;
        if (!text) return res.status(400).send("new text missing");
        try {
            const comment = await db.comments.findOneAndUpdate(
                { _id: req.params.id, author: req.user },
                { $set: { text: text } },
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
