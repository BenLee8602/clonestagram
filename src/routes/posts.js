const express = require("express");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { requireLogin } = require("../middlewares/auth");


function getPostsRouter(db, img) {
    const router = express.Router();


    // get all posts
    router.get("/", async (req, res) => {
        try {
            const posts = await db.posts.find({}).sort({ posted: "desc" });
            for (let i = 0; i < posts.length; ++i)
                posts[i].image = await img.getImage(posts[i].image);
            res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // create new post
    router.post("/", requireLogin, upload.single("image"), async (req, res) => {
        try {
            const imageName = img.generateImageName();

            await img.putImage(imageName, req.file.buffer, req.file.mimetype);

            const newPost = await db.posts.create({
                author: req.user,
                image: imageName,
                caption: req.body.caption
            });
            await newPost.save();

            res.status(200).json(newPost);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get a post by id
    router.get("/:id", async (req, res) => {
        try {
            const post = await db.posts.findById(req.params.id);
            if (!post) return res.status(404).json("post not found");
            post.image = await img.getImage(post.image);
            res.status(200).json(post);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // like a post
    router.put("/:id/like", requireLogin, async (req, res) => {
        try {
            const post = await db.posts.findOneAndUpdate(
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

            res.status(200).json(post.likes);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // comment on a post
    router.post("/:id/comment", requireLogin, async (req, res) => {
        try {
            const newComment = {
                _id: db.objectId(),
                author: req.user,
                posted: Date.now(),
                text: req.body.comment,
                likes: [],
                replies: []
            };

            await db.posts.updateOne(
                { _id: req.params.id },
                { $push: { comments: newComment } }
            );
            res.status(200).json(newComment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit a post
    router.put("/:id", requireLogin, async (req, res) => {
        try {
            const post = await db.posts.updateOne(
                { _id: req.params.id, author: req.user },
                { $set: { caption: req.body.caption } }
            );
            if (post) res.status(200).json(req.body.caption);
            else res.status(400).json(req.body.caption);
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
            if (!post) res.status(404).json(req.params.id);
            
            await img.deleteImage(post.image);

            res.status(200).json(req.params.id);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getPostsRouter;
