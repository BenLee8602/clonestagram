const express = require("express");

const { requireLogin } = require("../middlewares/auth");
const { getPageInfo } = require("../middlewares/page");


function getLikesRouter(db, img) {
    const router = express.Router();


    // like a post or comment
    router.put("/:parent", requireLogin, async (req, res) => {
        const parentType = req.body.parentType;
        if (parentType !== "post" && parentType !== "comment")
            return res.status(400).json("parent type must be \"post\" or \"comment\"");
        const parentCollection = parentType === "post" ? db.posts : db.comments;

        try {
            const deleted = await db.likes.findOneAndDelete({
                likedBy: req.user,
                parent: req.params.parent
            });
            const inc = deleted ? -1 : 1;

            const parent = await parentCollection.findByIdAndUpdate(
                req.params.parent,
                { $inc: { likeCount: inc } }
            );
            if (!parent) return res.status(404).json("parent not found");

            if (deleted) return res.status(200).json("unliked");
            await db.likes.create({
                parent: req.params.parent,
                parentType: parentType,
                likedBy: req.user
            });
            return res.status(201).json("liked");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get likes
    router.get("/:parent", getPageInfo, async (req, res) => {
        try {
            const names = (await db.likes.find({
                parent: req.params.parent,
                created: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            })).map(l => l.likedBy);

            const users1 = await db.users.find(
                { name: { $in: names } },
                "pfp name nick"
            );

            const users2 = await Promise.all(users1.map(async u => {
                u.pfp = await img.getImage(u.pfp);
                return u;
            }));

            res.status(200).json(users2);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getLikesRouter;
