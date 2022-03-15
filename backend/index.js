const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ben2:B3w3UOSDkLzBikVx@clonestagram.a7ygw.mongodb.net/clonestagram?retryWrites=true&w=majority");

const User = require("./models/user");
const Post = require("./models/post");

app.get("/login", (req, res) => {
    res.json({ success: true, msg: "worked" });
});

app.post("/register", (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    
    User.findOne({ name: name })
    .then(async doc => {
        if (doc) return res.json({ success: false, msg: "Username is taken" });
        const user = await User.create({
            name: name,
            pass: pass
        });
        console.log(user);
        await user.save();
        res.json({ success: true, msg: `User ${name} created` });
    })
    .catch(err => console.log(err));
});

app.post("/login", (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    
    User.findOne({ name: name })
    .then(doc => {
        if (!doc) res.json({ success: false, msg: `User ${name} not found` });
        else if (doc.pass != pass) res.json({ success: false, msg: `Incorrect password` });
        else res.json({ success: true, msg: `Logged in as ${name}` });
    })
    .catch(err => console.log(err));
});

app.listen(port, () => {
    console.log(`backend running on port ${port}`);
});
