require("dotenv").config();

const db = require("./src/config/db");
const img = require("./src/config/s3");

const createApp = require("./app");
const app = createApp(db, img);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
