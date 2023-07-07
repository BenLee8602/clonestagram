require("dotenv").config();

const db  = require("./db");
const img = require("./s3");

const createApp = require("../../src/app");
const app = createApp(db, img);

module.exports = app;
