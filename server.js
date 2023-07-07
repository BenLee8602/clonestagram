require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION_URI)
.then(() => console.log("Connected to database"))
.catch(err => console.log("Failed to connect to database: " + err));

const db = require("./src/config/db");
const img = require("./src/config/s3");

const createApp = require("./src/app");
const app = createApp(db, img);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
