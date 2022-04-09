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
        if (doc) return res.json({ success: false, msg: "username is taken" });

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({ name, pass: hash });
        await user.save();

        const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);

        res.json({ success: true, msg: `user ${name} created`, token: token });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


// login as user
router.post("/login", async (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;

    try {
        const user = await User.findOne({ name: name });
        if (user) {
            if (await bcrypt.compare(pass, user.pass)) {
                const token = jwt.sign(user.name, process.env.ACCESS_TOKEN_SECRET);
                res.json({ success: true, msg: `logged in as ${name}`, token: token });
            }
            else res.json({ success: false, msg: `incorrect password` });
        }
        else res.json({ success: false, msg: `user ${name} not found` });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


router.get("/", verifyToken, (req, res) => {
    res.json({ name: req.user });
});


// get user data for each name in list
router.post("/", async (req, res) => {
    try {
        const users = await User.find({ name: { $in: req.body.names } });
        res.json(users);
    } catch (err) {
        console.log(err);
        res.json({ users: [] });
    }
});


// get the given user's profile data
router.get("/:name/profile", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name }, "-_id -pass");
        if (!user) return res.json({ success: false, posts: [] });
        const posts = await Post.find({ author: req.params.name }).sort({ posted: "desc" });

        const token = req.headers["authorization"].split(' ')[1];
        var isThisUser = false;
        var isFollowing = false;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenUser) => {
            if (!err) {
                isThisUser = tokenUser === req.params.name;
                isFollowing = user.followers.includes(tokenUser);
            }
        });

        res.json({
            success: true,
            user: user,
            posts: posts,
            isThisUser: isThisUser,
            isFollowing: isFollowing
        });
    } catch (err) {
        console.log(err);
        res.json({success: false, err: err });
    }
});


// follow a user
router.get("/:name/follow", verifyToken, async (req, res) => {
    try {
        const thisUser  = req.user;
        const otherUser = req.params.name;

        if (thisUser === otherUser)
            return res.json({ success: false, msg: "cant follow yourself" });
        
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
        
        res.json({ success: true, user: updated });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: err });
    }
});


// get the logged in user's profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ name: req.user }, "-_id -pass");
        if (user) res.json({ success: true, user: user });
        else res.json({ success: false });
    } catch (err) {
        console.log(err);
        res.json({ success: false, err: err });
    }
});


// edit the logged in user's profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        await User.updateOne(
            { name: req.user },
            { $set: {
                pfp: req.body.pfp,
                nick: req.body.nick,
                bio: req.body.bio
            } }
        );
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({success: false, err: err });
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

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});


module.exports = router;
