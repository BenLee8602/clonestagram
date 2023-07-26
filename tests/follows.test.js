const request = require("supertest");

const app = require("./config/testapp");
const db = require("./config/db");
const img = require("./config/s3");


beforeAll(db.start);
afterAll(db.stop);

beforeEach(async () => {
    await db.resetData();
    img.resetImages();
});


describe("follow a user", () => {
    it("should not allow following oneself", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/follows/ben").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(400);
    });


    it("should follow if not already following", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/follows/someguy").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(201);

        const fol = await db.follows.find({}).count();
        expect(fol).toBe(2);

        const follower  = await db.users.findOne({ name: "ben" });
        const following = await db.users.findOne({ name: "someguy" });
        expect(follower.followingCount).toBe(1);
        expect(following.followerCount).toBe(1);
    });


    it("should unfollow if already following", async () => {
        const accessToken = db.genTestAccessToken("someguy");
        const res = await request(app).put("/api/follows/ben").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const fol = await db.follows.find({}).count();
        expect(fol).toBe(0);

        const follower  = await db.users.findOne({ name: "someguy" });
        const following = await db.users.findOne({ name: "ben" });
        expect(follower.followingCount).toBe(0);
        expect(following.followerCount).toBe(0);
    });
});


describe("get followers", () => {
    it("should return a list of followers for a given user", async () => {
        const res = await request(app).get("/api/follows/someguy/followers").send();
        expect(res.statusCode).toBe(200);

        const expected = [];
        expect(JSON.stringify(res.body)).toBe(JSON.stringify(expected));
    });
});


describe("get following", () => {
    it("should return a list of following for a given user", async () => {
        const res = await request(app).get("/api/follows/someguy/following").send();
        expect(res.statusCode).toBe(200);

        const expected = [{
            _id: "63cf278abc581a025767848d",
            name: "ben",
            pfp: "linkToBensProfilePicture",
            nick: "benjamin"
        }];
        expect(JSON.stringify(res.body)).toBe(JSON.stringify(expected));
    });
});


describe("get follower count", () => {
    it("should return a given user's follower count", async () => {
        const res = await request(app).get("/api/follows/ben/followers/count").send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toBe(1);
    });
});


describe("get following count", () => {
    it("should return a given user's following count", async () => {
        const res = await request(app).get("/api/follows/ben/following/count").send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toBe(0);
    });
});
