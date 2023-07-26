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


describe("register user", () => {
    it("should fail if username or password is missing", async () => {
        const res = await request(app).post("/api/users/register").send({
            name: "username123"
        });
        expect(res.statusCode).toBe(400);
        
        expect(res.body.refreshToken).toBeUndefined();
        expect(res.body.accessToken).toBeUndefined();

        expect(await db.users.findOne({ name: "username123" })).toBeNull();
        expect((await db.tokens.find({})).length).toBe(1);
    });


    it("should fail if username is taken", async () => {
        const res = await request(app).post("/api/users/register").send({
            name: "ben",
            pass: "abc123"
        });
        expect(res.statusCode).toBe(409);
        
        expect(res.body.refreshToken).toBeUndefined();
        expect(res.body.accessToken).toBeUndefined();

        expect((await db.users.find({})).length).toBe(2);
        expect((await db.tokens.find({})).length).toBe(1);
    });


    it("should pass given password and unique username", async () => {
        const res = await request(app).post("/api/users/register").send({
            name: "ben2",
            pass: "asd456"
        });
        expect(res.statusCode).toBe(200);
        
        expect(res.body.refreshToken).toBeDefined();
        expect(res.body.accessToken).toBeDefined();

        const newUser = await db.users.findOne({ name: "ben2" });
        expect(newUser).toBeDefined();
        expect(newUser.name).toBe("ben2");
        expect(newUser.pass).not.toBe("asd456"); // should be hashed
        expect((await db.tokens.find({})).length).toBe(2);
    });
});


describe("login user", () => {
    it("should fail if username or password is missing", async () => {
        const res = await request(app).post("/api/users/login").send({
            pass: "abc"
        });
        expect(res.statusCode).toBe(400);

        expect(res.body.refreshToken).toBeUndefined();
        expect(res.body.accessToken).toBeUndefined();

        expect((await db.tokens.find({})).length).toBe(1);
    });


    it("should fail if user is not found", async () => {
        const res = await request(app).post("/api/users/login").send({
            name: "doesntexist",
            pass: "p@s$w0Rd"
        });
        expect(res.statusCode).toBe(404);

        expect(res.body.refreshToken).toBeUndefined();
        expect(res.body.accessToken).toBeUndefined();

        expect((await db.tokens.find({})).length).toBe(1);
    });


    it("should fail if password is incorrect", async () => {
        const res = await request(app).post("/api/users/login").send({
            name: "ben",
            pass: "wrongpassword"
        });
        expect(res.statusCode).toBe(401);

        expect(res.body.refreshToken).toBeUndefined();
        expect(res.body.accessToken).toBeUndefined();

        expect((await db.tokens.find({})).length).toBe(1);
    });


    it("should pass given valid credentials", async () => {
        const res = await request(app).post("/api/users/login").send({
            name: "ben",
            pass: "abc"
        });
        expect(res.statusCode).toBe(200);

        expect(res.body.refreshToken).toBeDefined();
        expect(res.body.accessToken).toBeDefined();

        expect((await db.tokens.find({})).length).toBe(2);
    });
});


describe("get new access token", () => {
    it("should fail if refresh token is missing", async () => {
        const res = await request(app).post("/api/users/refresh").send();
        expect(res.statusCode).toBe(400);
        expect(res.body.accessToken).toBeUndefined();
        expect(res.body.user).toBeUndefined();
    });


    it("should fail given an invalid token", async () => {
        const res = await request(app).post("/api/users/refresh").send({
            refreshToken: "faketoken"
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toBe("invalid refresh token");
        expect(res.body.accessToken).toBeUndefined();
        expect(res.body.user).toBeUndefined();
    });


    it("should fail given an old token", async () => {
        const res = await request(app).post("/api/users/refresh").send({
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYmVuIiwiaWF0IjoxNjc0NjczNDI4fQ.7h-pHN8qZGFeL2iJZmmfpcKNXirhba_BX4jsCllGx2A"
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toBe("old refresh token");
        expect(res.body.accessToken).toBeUndefined();
        expect(res.body.user).toBeUndefined();
    });


    it("should pass given a valid, active refesh token", async () => {
        const res = await request(app).post("/api/users/refresh").send({
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYmVuIiwiaWF0IjoxNjc0NjcyOTE3fQ._u36cNgDORuYRI10_02PECE5Eacl-vm3co5fKD3QPgA"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user).toBe("ben");
    });
});


describe("logout user", () => {
    it("should delete token from database", async () => {
        const res = await request(app).delete("/api/users/logout").send({
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYmVuIiwiaWF0IjoxNjc0NjcyOTE3fQ._u36cNgDORuYRI10_02PECE5Eacl-vm3co5fKD3QPgA"
        });
        expect(res.statusCode).toBe(200);
        expect((await db.tokens.find({})).length).toBe(0);
    });
});


describe("search users", () => {
    it("should accept partial match and ignore case", async () => {
        const res = await request(app).get("/api/users/search/En").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        for (const user of res.body) expect(user.name).toMatch(/En/i);
    });
});


describe("get one user's data", () => {
    it("should fail if user doesnt exist", async () => {
        const res = await request(app).get("/api/users/doesntExist/profile").send();
        expect(res.statusCode).toBe(404);
    });


    it("should pass if user exists", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).get("/api/users/ben/profile").query({
            cur: "someguy"
        }).set({
            "Authorization": "Bearer " + accessToken
        }).send();
        expect(res.statusCode).toBe(200);

        const expected = {
            name: "ben",
            pfp: "linkToBensProfilePicture",
            nick: "benjamin",
            bio: "hi my name is ben",
            following: true
        };

        expect(JSON.stringify(res.body)).toBe(JSON.stringify(expected));
    });
});


describe("edit user profile", () => {
    it("should fail if nickname or bio is missing", async () => {
        const accessToken = db.genTestAccessToken("someguy");
        const res = await request(app).put("/api/users/profile").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            nick: "new nickname",
            msg: "hi"
        });
        expect(res.statusCode).toBe(400);

        const user = await db.users.findOne({ name: "someguy" });
        expect(user.nick).toBe("awesome nickname");
        expect(user.bio).toBe("awesome bio");
    });


    it("should only update nickname and bio if no pfp given", async () => {
        const accessToken = db.genTestAccessToken("someguy");
        const res = await request(app).put("/api/users/profile").set({
            "Authorization": "Bearer " + accessToken
        }).send({
            nick: "new nickname",
            bio: "new bio"
        });
        expect(res.statusCode).toBe(200);

        const user = await db.users.findOne({ name: "someguy" });
        expect(user.nick).toBe("new nickname");
        expect(user.bio).toBe("new bio");
        expect(user.pfp).toBe("");
    });


    it("should replace old pfp if it exists", async () => {
        const accessToken = db.genTestAccessToken("ben");
        const res = await request(app).put("/api/users/profile").set({
            "Authorization": "Bearer " + accessToken
        }).attach("image", Buffer.from("test 3 pfp buffer"), "image").field({
            nick: "nickname from test 3",
            bio: "bio from test 3"
        });
        expect(res.statusCode).toBe(200);

        const user = await db.users.findOne({ name: "ben" });
        expect(user.nick).toBe("nickname from test 3");
        expect(user.bio).toBe("bio from test 3");
        expect(user.pfp).toBe("bensProfilePicture");
    });


    it("should create new pfp if not exists", async () => {
        const accessToken = db.genTestAccessToken("someguy");
        const res = await request(app).put("/api/users/profile").set({
            "Authorization": "Bearer " + accessToken
        }).attach("image", Buffer.from("test 4 pfp buffer"), "image").field({
            nick: "test 4 nickname",
            bio: "test 4 bio"
        });
        expect(res.statusCode).toBe(200);

        const user = await db.users.findOne({ name: "someguy" });
        expect(user.nick).toBe("test 4 nickname");
        expect(user.bio).toBe("test 4 bio");
        expect(user.pfp).not.toBe("");
    });
});
