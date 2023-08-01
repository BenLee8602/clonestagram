const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { requireLogin } = require("../middlewares/auth");
const { getPageInfo } = require("../middlewares/page");


function genRefreshToken(id, name) {
    return jwt.sign(
        { id, name },
        process.env.REFRESH_TOKEN_SECRET
    );
}

function genAccessToken(id, name) {
    return jwt.sign(
        { id, name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
}


function getUsersRouter(db, img) {
    const router = express.Router();


    // register new user
    router.post("/register", async (req, res) => {
        const name = req.body.name;
        const pass = req.body.pass;
        if (!name || !pass) return res.status(400).json("missing username or password");

        try {
            const doc = await db.users.findOne({ name }, "name");
            if (doc) return res.status(409).json("username is taken");

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(pass, salt);
            
            const user = await db.users.create({ name, pass: hash });
            const id = user._id.toString();

            const refreshToken = genRefreshToken(id, name);
            const accessToken = genAccessToken(id, name);

            await db.tokens.create({ token: refreshToken });
            res.status(200).json({ refreshToken, accessToken, user: { id, name } });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // login as user
    router.post("/login", async (req, res) => {
        const name = req.body.name;
        const pass = req.body.pass;
        if (!name || !pass) return res.status(400).json("missing username or password");

        try {
            const user = await db.users.findOne({ name: name });
            if (!user) return res.status(404).json(`user ${name} not found`);
            if (!await bcrypt.compare(pass, user.pass)) return res.status(401).json("incorrect password");

            const id = user._id.toString();
            const refreshToken = genRefreshToken(id, name);
            const accessToken = genAccessToken(id, name);

            await db.tokens.create({ token: refreshToken });
            res.status(200).json({ refreshToken, accessToken, user: { id, name } });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get new access token
    router.post("/refresh", async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.status(400).json("missing refresh token");
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, token) => {
                if (err) return res.status(401).json("invalid refresh token");
                if (!await db.tokens.findOne({ token: refreshToken })) return res.status(401).json("old refresh token");
                const accessToken = genAccessToken(token.id, token.name);
                res.status(200).json({ accessToken, user: { id: token.id, name: token.name } });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // logout user
    router.delete("/logout", async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.status(400).json("missing refresh token");
        try {
            const deleted = await db.tokens.findOneAndDelete({ token: refreshToken });
            if (!deleted) return res.status(404).json("token not found");
            res.status(200).json("logged out");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // search users
    router.get("/search/:query", getPageInfo, async (req, res) => {
        const query = { $regex: req.params.query, $options: "i" };
        try {
            const users = await db.users.find({
                name: query,
                posted: { $lt: req.page.start }
            }, "-pass", {
                skip: db.pageSize * req.page.number,
                limit: db.pageSize
            });
            for (let i = 0; i < users.length; ++i) users[i].pfp = await img.getImage(users[i].pfp);
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get the given user's profile data
    router.get("/:name/profile", async (req, res) => {
        try {
            const user = await db.users.findOne(
                { name: req.params.name },
                "-pass"
            ).lean();
            if (!user) return res.status(404).json("user not found");
            user.pfp = await img.getImage(user.pfp);
            if (!req.query.cur) return res.status(200).json(user);
            
            const following = await db.follows.findOne({
                follower: req.query.cur,
                following: req.params.name
            });
            res.status(200).json({ ...user, following: !!following });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit the logged in user's profile
    router.put("/profile", requireLogin, upload.single("image"), async (req, res) => {
        const nick = req.body.nick || "";
        const bio = req.body.bio || "";

        try {
            const user = await db.users.findByIdAndUpdate(
                req.user.id,
                { nick, bio },
                {
                    fields: { "_id": 0, "pass": 0, "__v": 0 },
                    new: true
                }
            );

            if (!req.file) return res.status(200).json(user);
            if (!user.pfp) {
                user.pfp = img.generateImageName();
                await db.users.findByIdAndUpdate(
                    req.user.id,
                    { pfp: user.pfp }
                );
            }
            await img.putImage(user.pfp, req.file.buffer, req.file.mimetype);

            user.pfp = img.getImage(user.pfp);
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // delete the logged in user
    router.delete("/profile", requireLogin, async (req, res) => {
        try {
            // delete images from s3
            const posts = await db.posts.find({ author: req.user.name }).lean();
            for (let i = 0; i < posts.length; ++i) await img.deleteImage(posts[i].image);

            // delete posts
            await db.posts.deleteMany({ author: req.user.name });

            // delete comments
            await db.comments.deleteMany({ author: req.user.name });

            // delete followers and following
            await db.follows.deleteMany({ $or: [
                { follower: req.user.name },
                { following: req.user.name }
            ] });

            // delete likes
            await db.likes.deleteMany({ likedBy: req.user.name });

            // delete account
            const user = await db.users.findOneAndDelete({ name: req.user.name });

            // delete user profile picture
            if (user.pfp) await img.deleteImage(user.pfp);

            // done!
            res.status(200).json("user deleted");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getUsersRouter;
