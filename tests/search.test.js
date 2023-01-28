const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { resetDbTestData, genTestAccessToken } = require("./testdata");
const app = require("./testapp");
const db = require("../src/config/db");
const img = require("../src/config/mocks3");


let mongodb;

beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri());
});

beforeEach(async () => {
    await resetDbTestData();
    img.resetImages();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
});


describe("search", () => {
    it("should return posts and users containing query in the name or author", async () => {
        const res = await request(app).get("/api/search/ben").send();
        expect(res.statusCode).toBe(200);

        expect(res.body.users.length).toBe(1);
        expect(res.body.posts.length).toBe(2);
        for (const user of res.body.users) expect(user.name).toMatch(/ben/i);
        for (const post of res.body.posts) expect(post.author).toMatch(/ben/i);
    });


    it("should search posts by caption", async () => {
        const res = await request(app).get("/api/search/cool").send();
        expect(res.statusCode).toBe(200);

        expect(res.body.posts.length).toBe(1);
        expect(res.body.posts[0].caption).toMatch(/cool/i);
    });
});
