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


describe("get all posts", () => {
    it("should return all posts in db", async () => {
        const res = await request(app).get("/api/posts").send();
        expect(res.statusCode).toBe(200);
        
        const expected = [
            {
                "_id": db.objectId("63cf2bb1bc581a02576784e8"),
                "author": "ben",
                "posted": "2023-01-24T00:52:01.675Z",
                "image": "linkToPost2Image",
                "caption": "cccc",
                "likes": ["someguy"]
            }, {
                "_id": db.objectId("63cf287bbc581a02576784aa"),
                "author": "ben",
                "posted": "2023-01-24T00:38:19.476Z",
                "image": "linkToPost1Image",
                "caption": "a cool caption",
                "likes": ["ben", "someguy"]
            }
        ];

        expect(JSON.stringify(res.body)).toBe(JSON.stringify(expected));
    });
});


describe("get post by id", () => {
    it("should fail if post doesnt exist", async () => {
        const res = await request(app).get("/api/posts/e020ee4ae7584f86e1fe33f7").send();
        expect(res.statusCode).toBe(404);
    });


    it("should return post if exists", async () => {
        const res = await request(app).get("/api/posts/63cf287bbc581a02576784aa").send();
        expect(res.statusCode).toBe(200);
        expect(JSON.stringify(res.body)).toBe(JSON.stringify({
            "_id": db.objectId("63cf287bbc581a02576784aa"),
            "author": "ben",
            "posted": "2023-01-24T00:38:19.476Z",
            "image": "linkToPost1Image",
            "caption": "a cool caption",
            "likes": ["ben", "someguy"]
        }));
    });
});


describe("create new post", () => {
    it("should add the post to the database", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).post("/api/posts").set({
            "Authorization": "Bearer " + accessToken
        }).attach("image", Buffer.from("new post image buffer"), "image").field({
            caption: "awesome caption"
        });
        expect(res.statusCode).toBe(200);
        
        const posts = await db.posts.find({});
        expect(posts.length).toBe(3);
    });
});


describe("like a post", () => {
    it("should fail if post doesnt exist", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/05224502d0ca37c7afd61f6e/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should like if not already", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/63cf2bb1bc581a02576784e8/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf2bb1bc581a02576784e8");
        expect(post.likes).toContain("ben");
    });


    it("should unlike if already liked", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).put("/api/posts/63cf287bbc581a02576784aa/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf287bbc581a02576784aa");
        expect(post.likes).not.toContain("someguy");
    });
});


describe("edit a post", () => {
    it("should fail if caption is not given", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/63cf287bbc581a02576784aa").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            msg: "how are you"
        });
        expect(res.statusCode).toBe(400);
    });


    it("should fail if post doesnt exist", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).put("/api/posts/01abe3720d6e382d80970673").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            caption: "this is a new caption"
        });
        expect(res.statusCode).toBe(404);
    });


    it("should update a valid post given a caption", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/63cf287bbc581a02576784aa").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            caption: "crazy caption"
        });
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf287bbc581a02576784aa");
        expect(post.caption).toBe("crazy caption");
    });
});


describe("delete a post", () => {
    it("should fail if post doesnt exist", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).delete("/api/posts/cb760905e8fa1745e1457e0b").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should delete post if exists", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).delete("/api/posts/63cf2bb1bc581a02576784e8").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf2bb1bc581a02576784e8");
        expect(post).toBeNull();
    });
});
