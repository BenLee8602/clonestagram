const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ msg: "hello from backend" });
});

app.listen(port, () => {
    console.log(`backend running on port ${port}`);
});
