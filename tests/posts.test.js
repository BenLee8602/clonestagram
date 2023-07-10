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


describe("get all posts", () => {
    it("should return all posts in db", async () => {
        const res = await request(app).get("/api/posts").send();
        expect(res.statusCode).toBe(200);
        
        expect(res.body.length).toBe(2);
        expect(res.body[0]._id).toBe("63cf2bb1bc581a02576784e8");
        expect(res.body[1]._id).toBe("63cf287bbc581a02576784aa");
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


describe("get posts by author", () => {
    it("should return all posts created by author", async () => {
        const res = await request(app).get("/api/posts/author/ben").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        for (const post of res.body) expect(post.author).toBe("ben");
    });
});


describe("search posts", () => {
    it("should search by author", async () => {
        const res = await request(app).get("/api/posts/search/ben").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        for (const post of res.body) expect(post.author).toMatch(/ben/i);
    });


    it("should search by caption", async () => {
        const res = await request(app).get("/api/posts/search/cool").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        for (const post of res.body) expect(post.caption).toMatch(/cool/i);
    })
});


describe("create new post", () => {
    it("should add the post to the database", async () => {
        const accessToken = db.genTestAccessToken("someguy");
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
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/05224502d0ca37c7afd61f6e/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should like if not already", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/63cf2bb1bc581a02576784e8/like").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf2bb1bc581a02576784e8");
        expect(post.likes).toContain("ben");
    });


    it("should unlike if already liked", async () => {
        const accessToken = db.genTestAccessToken("someguy");
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
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/posts/63cf287bbc581a02576784aa").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            msg: "how are you"
        });
        expect(res.statusCode).toBe(400);
    });


    it("should fail if post doesnt exist", async () => {
        const accessToken = db.genTestAccessToken("someguy");
        const res = await request(app).put("/api/posts/01abe3720d6e382d80970673").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            caption: "this is a new caption"
        });
        expect(res.statusCode).toBe(404);
    });


    it("should update a valid post given a caption", async () => {
        const accessToken = db.genTestAccessToken("ben");
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
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).delete("/api/posts/cb760905e8fa1745e1457e0b").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(404);
    });


    it("should delete post if exists", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).delete("/api/posts/63cf2bb1bc581a02576784e8").set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const post = await db.posts.findById("63cf2bb1bc581a02576784e8");
        expect(post).toBeNull();
    });
});
