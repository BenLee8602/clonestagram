const path = require("path");
const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const followsRouter = require("./routes/follows");
const likesRouter = require("./routes/likes");


function createApp(database, imageStorage) {
    const app = express();

    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(express.json({ limit: "50mb" }));
    app.use(express.static("client/build"));
    
    app.use(cors({ origin: "*" }));
    
    app.use("/api/users", usersRouter(database, imageStorage));
    app.use("/api/posts", postsRouter(database, imageStorage));
    app.use("/api/comments", commentsRouter(database));
    app.use("/api/follows", followsRouter(database, imageStorage));
    app.use("/api/likes", likesRouter(database, imageStorage));
    
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
    });

    return app;
}


module.exports = createApp;
