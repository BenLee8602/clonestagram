const express = require("express");

const { requireLogin } = require("../middlewares/auth");
const { getPageInfo } = require("../middlewares/page");


function getFollowsRouter(db, img) {
    const router = express.Router();


    // follow a user
    router.put("/:name", requireLogin, async (req, res) => {
        try {
            const fol = {
                follower: req.user,
                following: req.params.name
            };
            if (fol.follower === fol.following)
                return res.status(400).json("cant follow yourself");
            
            const deleted = await db.follows.findOneAndDelete(fol);
            if (deleted) {
                await db.users.updateOne(
                    { name: fol.follower },
                    { $inc: { followingCount: -1 } }
                );
                await db.users.updateOne(
                    { name: fol.following },
                    { $inc: { followerCount: -1 } }
                );
                return res.status(200).json("unfollowed");
            }

            await db.users.updateOne(
                { name: fol.follower },
                { $inc: { followingCount: 1 } }
            );
            await db.users.updateOne(
                { name: fol.following },
                { $inc: { followerCount: 1 } }
            );
            await db.follows.create(fol);
            res.status(201).json("followed");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get followers
    router.get("/:name/followers", getPageInfo, async (req, res) => {
        try {
            const names = (await db.follows.find({
                following: req.params.name,
                created: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            })).map(f => f.follower);

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


    // get following
    router.get("/:name/following", getPageInfo, async (req, res) => {
        try {
            const names = (await db.follows.find({
                follower: req.params.name,
                created: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            })).map(f => f.following);

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


module.exports = getFollowsRouter;
