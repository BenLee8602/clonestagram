const express = require("express");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { requireLogin } = require("../middlewares/auth");
const { getPageInfo } = require("../middlewares/page");


function getPostsRouter(db, img) {
    const router = express.Router();


    async function checkLike(post, cur) {
        if (!cur) return false;
        return !!(await db.likes.findOne({
            parent: post._id,
            likedBy: cur
        }));
    }


    // get all posts
    router.get("/", getPageInfo, async (req, res) => {
        try {
            const posts = await db.posts.find({
                posted: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            }).sort({ posted: "desc" }).lean();

            for (let i = 0; i < posts.length; ++i) {
                posts[i].image = await img.getImage(posts[i].image);
                posts[i].liked = await checkLike(posts[i], req.query.cur);
            }

            res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get a post by id
    router.get("/:id", async (req, res) => {
        try {
            var post = await db.posts.findById(req.params.id, "-__v").lean();
            if (!post) return res.status(404).json("post not found");
            post.image = await img.getImage(post.image);
            post.liked = await checkLike(post, req.query.cur);
            res.status(200).json(post);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get posts by author
    router.get("/author/:name", getPageInfo, async (req, res) => {
        try {
            const posts = await db.posts.find({
                author: req.params.name,
                posted: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            }).sort({ posted: "desc" }).lean();

            for (let i = 0; i < posts.length; ++i) {
                posts[i].image = await img.getImage(posts[i].image);
                posts[i].liked = await checkLike(posts[i], req.query.cur);
            }

            res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // search posts by author and caption
    router.get("/search/:query", getPageInfo, async (req, res) => {
        const query = { $regex: req.params.query, $options: "i" };
        try {
            const posts = await db.posts.find({
                $or: [{ author: query }, { caption: query }],
                posted: { $lt: req.page.start }
            }, null, {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            }).lean();

            for (let i = 0; i < posts.length; ++i) {
                posts[i].image = await img.getImage(posts[i].image);
                posts[i].liked = await checkLike(posts[i], req.query.cur);
            }

            res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // create new post
    router.post("/", requireLogin, upload.single("image"), async (req, res) => {
        const caption = req.body.caption || "";
        try {
            const imageName = img.generateImageName();
            await img.putImage(imageName, req.file.buffer, req.file.mimetype);

            const newPost = await db.posts.create({
                author: req.user,
                image: imageName,
                caption: caption
            });
            
            await db.users.updateOne(
                { name: req.user },
                { $inc: { postCount: 1 } }
            );

            res.status(200).json(newPost);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a post
    router.put("/:id", requireLogin, async (req, res) => {
        const caption = req.body.caption;
        if (!caption) return res.status(400).json("new caption missing");
        try {
            const post = await db.posts.findOneAndUpdate(
                { _id: req.params.id, author: req.user },
                { $set: { caption: caption } }
            );
            if (!post) return res.status(404).json("post not found");
            res.status(200).json(caption);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete a post
    router.delete("/:id", requireLogin, async (req, res) => {
        try {
            const post = await db.posts.findOneAndDelete(
                { _id: req.params.id, author: req.user },
            );
            if (!post) return res.status(404).json(req.params.id);
            
            await img.deleteImage(post.image);
            
            await db.users.updateOne(
                { name: req.user },
                { $inc: { postCount: -1 } }
            );

            res.status(200).json(req.params.id);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getPostsRouter;
