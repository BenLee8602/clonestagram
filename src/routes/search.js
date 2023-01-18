const express = require("express");


function getSearchRouter(db, img) {
    const router = express.Router();


    router.get("/:query", async (req, res) => {
        const query = { $regex: req.params.query, $options: "i" };
        try {
            const users = await db.users.find({ name: query }, "-_id -pass");
            for (let i = 0; i < users.length; ++i) users[i].pfp = await img.getImage(users[i].pfp);
    
            const posts = await db.posts.find({ $or: [{ author: query }, { caption: query }] });
            for (let i = 0; i < posts.length; ++i) posts[i].image = await img.getImage(posts[i].image);
    
            res.status(200).json({ query: req.params.query, users, posts });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getSearchRouter;
