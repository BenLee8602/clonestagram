require("dotenv").config();

const db  = require("../src/config/db");
const img = require("../src/config/mocks3");

const createApp = require("../app");
const app = createApp(db, img);

module.exports = app;
