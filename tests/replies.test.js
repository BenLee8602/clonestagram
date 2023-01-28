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


describe("get replies for a comment", () => {
    it("should return array of replies", async () => {
        const res = await request(app).get("/api/replies/63cf29c0bc581a02576784b3").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        for (const reply of res.body) expect(reply.parent).toBe("63cf29c0bc581a02576784b3");
    });
});


describe("create reply", () => {
    it("should fail if reply text is missing", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).post("/api/replies/63cf2c42bc581a02576784f6").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            aBoolValue: true
        });
        expect(res.statusCode).toBe(400);
    });


    it("should fail if comment doesnt exist", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).post("/api/replies/4e334115db6770630cd4cf1d").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            text: "a new reply"
        });
        expect(res.statusCode).toBe(404);
    });


    it("should create reply for valid comment given reply text", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).post("/api/replies/63cf2c42bc581a02576784f6").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            text: "amazing new reply"
        });
        expect(res.statusCode).toBe(200);

        const reply = await db.replies.findOne({
            parent: "63cf2c42bc581a02576784f6",
            text: "amazing new reply",
            author: "ben"
        });
        expect(reply).not.toBeNull();
    });
});


describe("like reply", () => {
    it("should fail if reply doesnt exist", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).put("/api/replies/24c9c3ff2c6adc51896a8d0c/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should like if not already", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/replies/63cf2b16bc581a02576784e3/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const reply = await db.replies.findById("63cf2b16bc581a02576784e3");
        expect(reply.likes).toContain("ben");
    });


    it("should unlike if already liked", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).put("/api/replies/63cf29d5bc581a02576784bb/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const reply = await db.replies.findById("63cf29d5bc581a02576784bb");
        expect(reply.likes).not.toContain("someguy");
    });
});


describe("edit a reply", () => {
    it("should fail if new text is not given", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/replies/63cf29d5bc581a02576784bb").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            greeting: "hi"
        });
        expect(res.statusCode).toBe(400);
    });


    it("should fail if reply doesnt exist", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).put("/api/replies/12958ba8f5a01b2ad745243c").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            text: "this reply doesnt exist!"
        });
        expect(res.statusCode).toBe(404);
    });


    it("should update a valid reply given a caption", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).put("/api/replies/63cf2a19bc581a02576784cf").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            text: "brand new reply text"
        });
        expect(res.statusCode).toBe(200);

        const reply = await db.replies.findById("63cf2a19bc581a02576784cf");
        expect(reply.text).toBe("brand new reply text");
    });
});


describe("delete a reply", () => {
    it("should fail if reply doesnt exist", async () => {
        const accessToken = genTestAccessToken("someguy");
        const res = await request(app).delete("/api/replies/929ddb07b5b00fe77bc8a6f9").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should delete reply if exists", async () => {
        const accessToken = genTestAccessToken("ben");
        const res = await request(app).delete("/api/replies/63cf2c5cbc581a0257678503").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const reply = await db.replies.findById("63cf2c5cbc581a0257678503");
        expect(reply).toBeNull();
    });
});
