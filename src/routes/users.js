const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");

const { verifyToken } = require("../middleware/authorize");


// register new user
router.post("/register", async (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    
    try {
        const doc = await User.findOne({ name: name }, "-_id name");
        if (doc) return res.status(409).json("username is taken");

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({ name, pass: hash });
        await user.save();

        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json(token);
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
        const user = await User.findOne({ name: name });
        if (!user) return res.status(404).json(`user ${name} not found`);
        if (!await bcrypt.compare(pass, user.pass)) return res.status(401).json("incorrect password");
        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json(token);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.get("/", verifyToken, (req, res) => {
    res.status(200).json({ name: req.user });
});


// get user data for each name in list
router.post("/", async (req, res) => {
    try {
        const users = await User.find({ name: { $in: req.body.names } });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// get the given user's profile data
router.get("/:name/profile", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name }, "-_id -pass");
        if (!user) return res.status(404).json("user not found");
        const posts = await Post.find({ author: req.params.name }).sort({ posted: "desc" });

        const token = req.headers["authorization"].split(' ')[1];
        var isThisUser = false;
        var isFollowing = false;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenUser) => {
            if (err) return;
            isThisUser = tokenUser === req.params.name;
            isFollowing = user.followers.includes(tokenUser);
        });

        res.status(200).json({ user, posts, isThisUser, isFollowing });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// follow a user
router.get("/:name/follow", verifyToken, async (req, res) => {
    try {
        const thisUser  = req.user;
        const otherUser = req.params.name;

        if (thisUser === otherUser) return res.status(400).json("cant follow yourself");
        
        // this user
        await User.updateOne(
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
        const updated = await User.findOneAndUpdate(
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
            { new: true }
        );
        
        res.status(200).json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// get the logged in user's profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ name: req.user }, "-_id -pass");
        if (user) res.status(200).json(user);
        else res.status(404).json("user not found");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// edit the logged in user's profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { name: req.user },
            { $set: {
                pfp: req.body.pfp,
                nick: req.body.nick,
                bio: req.body.bio
            } }
        );
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// delete the logged in user
router.delete("/profile", verifyToken, async (req, res) => {
    try {
        // delete user posts
        await Post.deleteMany(
            { author: req.user }
        );

        // delete user comments
        await Post.updateMany(
            { },
            { $pull: { comments: { author: req.user } } }
        );

        // delete user replies
        await Post.updateMany(
            { },
            { $pull: { "comments.$[].replies": { author: req.user } } }
        );

        // delete user from likes lists (posts, comments, replies)
        await Post.updateMany(
            { },
            { $pull: { likes: req.user } }
        );

        await Post.updateMany(
            { },
            { $pull: { "comments.$[].likes": req.user } }
        );

        await Post.updateMany(
            { },
            { $pull: { "comments.$[].replies.$[].likes": req.user } }
        );

        // delete user from follower lists
        await User.updateMany(
            { },
            { $pull: { followers: req.user } }
        );

        // delete user from following lists
        await User.updateMany(
            { },
            { $pull: { following: req.user } }
        );

        // delete account
        await User.deleteOne(
            { name: req.user }
        );

        res.status(200).json("user deleted");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;
