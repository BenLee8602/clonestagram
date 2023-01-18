const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { requireLogin } = require("../middlewares/auth");

function genAccessToken(user) {
    return jwt.sign(
        { user },
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

        try {
            const doc = await db.users.findOne({ name }, "-_id name");
            if (doc) return res.status(409).json("username is taken");

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(pass, salt);
            await db.users.create({ name, pass: hash });

            const refreshToken = jwt.sign({ user: name }, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = genAccessToken(name);
            await db.tokens.create({ token: refreshToken });

            res.status(200).json({ refreshToken, accessToken });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // login as user
    router.post("/login", async (req, res) => {
        const name = req.body.name;
        const pass = req.body.pass;

        try {
            const user = await db.users.findOne({ name: name });
            if (!user) return res.status(404).json(`user ${name} not found`);
            if (!await bcrypt.compare(pass, user.pass)) return res.status(401).json("incorrect password");

            const refreshToken = jwt.sign({ user: name }, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = genAccessToken(name);
            await db.tokens.create({ token: refreshToken });

            res.status(200).json({ refreshToken, accessToken });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    router.post("/refresh", async (req, res) => {
        const refreshToken = req.body.refreshToken;
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, token) => {
                if (err) return res.status(401).json("invalid refresh token");
                if (!await db.tokens.findOne({ token: refreshToken })) return res.status(401).json("old refresh token");
                const accessToken = genAccessToken(token.user);
                res.status(200).json({ accessToken, user: token.user });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    router.delete("/logout", async (req, res) => {
        try {
            await db.tokens.deleteOne({ token: req.body.token });
            res.status(200).json("logged out");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    router.get("/", requireLogin, (req, res) => {
        res.status(200).json({ name: req.user });
    });


    // get user data for each name in list
    router.post("/", async (req, res) => {
        try {
            const users = await db.users.find({ name: { $in: req.body.names } }, "-_id -pass -__v");
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
            const user = await db.users.findOne({ name: req.params.name }, "-_id -pass -__v");
            if (!user) return res.status(404).json("user not found");
            user.pfp = await img.getImage(user.pfp);

            const posts = await db.posts.find({ author: req.params.name }).sort({ posted: "desc" });
            for (let i = 0; i < posts.length; ++i)
                posts[i].image = await img.getImage(posts[i].image);

            const token = req.headers["authorization"].split(' ')[1];
            var isThisUser = false;
            var isFollowing = false;
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                if (err) return;
                isThisUser = data.user === req.params.name;
                isFollowing = user.followers.includes(data.user);
            });

            res.status(200).json({ user, posts, isThisUser, isFollowing });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // follow a user
    router.get("/:name/follow", requireLogin, async (req, res) => {
        try {
            const thisUser  = req.user;
            const otherUser = req.params.name;

            if (thisUser === otherUser) return res.status(400).json("cant follow yourself");
            
            // this user
            await db.users.updateOne(
                { name: thisUser },
                [{ $set: {
                    following: {
                        $cond: {
                            if: { $in: [otherUser, "$following"] },
                            then: { $setDifference: ["$following", [otherUser]] },
                            else: { $concatArrays:  ["$following", [otherUser]] }
                        }
                    }
                } }]
            );

            // other user
            const updated = await db.users.findOneAndUpdate(
                { name: otherUser },
                [{ $set: {
                    followers: {
                        $cond: {
                            if: { $in: [thisUser, "$followers"] },
                            then: { $setDifference: ["$followers", [thisUser]] },
                            else: { $concatArrays:  ["$followers", [thisUser]] }
                        }
                    }
                } }],
                {
                    fields: { "_id": 0, "pass": 0, "pfp": 0, "__v": 0 },
                    new: true
                }
            );

            res.status(200).json(updated);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // get the logged in user's profile
    router.get("/profile", requireLogin, async (req, res) => {
        try {
            const user = await db.users.findOne({ name: req.user }, "-_id -pass -__v");
            if (user) res.status(200).json(user);
            else res.status(404).json("user not found");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    // edit the logged in user's profile
    router.put("/profile", requireLogin, upload.single("image"), async (req, res) => {
        try {
            const user = await db.users.findOneAndUpdate(
                { name: req.user },
                { $set: {
                    nick: req.body.nick,
                    bio: req.body.bio
                } },
                {
                    fields: { "_id": 0, "pass": 0, "__v": 0 },
                    new: true
                }
            );

            if (!req.file) return res.status(200).json(user);
            if (!user.pfp) {
                user.pfp = img.generateImageName();
                await db.users.updateOne(
                    { name: req.user },
                    { $set: { pfp: user.pfp } },
                    {
                        fields: { "_id": 0, "pass": 0, "__v": 0 },
                        new: true
                    }
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
            // delete user post images from s3
            const posts = await db.posts.find({ author: req.user });
            for (let i = 0; i < posts.length; ++i) await img.deleteImage(posts[i].image);

            // delete user posts
            await db.posts.deleteMany(
                { author: req.user }
            );

            // delete user comments
            await db.posts.updateMany(
                { },
                { $pull: { comments: { author: req.user } } }
            );

            // delete user replies
            await db.posts.updateMany(
                { },
                { $pull: { "comments.$[].replies": { author: req.user } } }
            );

            // delete user from likes lists (posts, comments, replies)
            await db.posts.updateMany(
                { },
                { $pull: { likes: req.user } }
            );

            await db.posts.updateMany(
                { },
                { $pull: { "comments.$[].likes": req.user } }
            );

            await db.posts.updateMany(
                { },
                { $pull: { "comments.$[].replies.$[].likes": req.user } }
            );

            // delete user from follower lists
            await db.users.updateMany(
                { },
                { $pull: { followers: req.user } }
            );

            // delete user from following lists
            await db.users.updateMany(
                { },
                { $pull: { following: req.user } }
            );

            // delete account
            const user = await db.users.findOneAndDelete(
                { name: req.user }
            );

            // delete user profile picture
            if (!user.pfp) return res.status(200).json("user deleted");
            await img.deleteImage(user.pfp);

            res.status(200).json("user deleted");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });


    return router;
}


module.exports = getUsersRouter;
