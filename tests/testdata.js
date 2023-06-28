const jwt = require("jsonwebtoken");
const db = require("../src/config/db");


async function resetDbTestData() {
    await db.users.deleteMany({});
    await db.tokens.deleteMany({});
    await db.posts.deleteMany({});
    await db.comments.deleteMany({});

    await db.users.insertMany([
        {
            "_id": db.objectId("63cf278abc581a025767848d"),
            "name": "ben",
            "pass": "$2b$10$4hBzoLGNiIN7STLo.Uuln.XHX3MaDJt2xd6m610uTLh6NV4pRB0Cm",
            "pfp": "bensProfilePicture",
            "nick": "benjamin",
            "bio": "hi my name is ben",
            "followers": ["someguy"],
            "following": []
        }, {
            "_id": db.objectId("63cf27d7bc581a0257678496"),
            "name": "someguy",
            "pass": "$2b$10$q9AWwrNN5RZO0qi5DPtp4OSBtXddkw510qC88i4JaY5NznJPb1B/C",
            "pfp": "",
            "nick": "awesome nickname",
            "bio": "awesome bio",
            "followers": [],
            "following": ["ben"]
        }
    ]);

    await db.tokens.insertMany([
        {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYmVuIiwiaWF0IjoxNjc0NjcyOTE3fQ._u36cNgDORuYRI10_02PECE5Eacl-vm3co5fKD3QPgA"
        }
    ])
    
    await db.posts.insertMany([
        {
            "_id": db.objectId("63cf287bbc581a02576784aa"),
            "author": "ben",
            "image": "post1Image",
            "caption": "a cool caption",
            "likes": ["ben", "someguy"],
            "posted": 1674520699476
        }, {
            "_id": db.objectId("63cf2bb1bc581a02576784e8"),
            "author": "ben",
            "image": "post2Image",
            "caption": "cccc",
            "likes": ["someguy"],
            "posted": 1674521521675
        }
    ]);
    
    await db.comments.insertMany([
        {
            "_id": db.objectId("63cf29c0bc581a02576784b3"),
            "parent": db.objectId("63cf287bbc581a02576784aa"),
            "author": "ben",
            "text": "first comment",
            "likes": ["ben", "someguy"],
            "posted": 1674521024573
        }, {
            "_id": db.objectId("63cf29c8bc581a02576784b7"),
            "parent": db.objectId("63cf287bbc581a02576784aa"),
            "author": "ben",
            "text": "another comment",
            "likes": ["someguy"],
            "posted": 1674521032206
        }, {
            "_id": db.objectId("63cf29f8bc581a02576784cb"),
            "parent": db.objectId("63cf287bbc581a02576784aa"),
            "author": "someguy",
            "text": "hi",
            "likes": ["ben"],
            "posted": 1674521080158
        }, {
            "_id": db.objectId("63cf2c42bc581a02576784f6"),
            "parent": db.objectId("63cf2bb1bc581a02576784e8"),
            "author": "someguy",
            "text": "cool",
            "likes": ["someguy", "ben"],
            "posted": 1674521666418
        }, {
            "_id": db.objectId("63cf29d5bc581a02576784bb"),
            "parent": db.objectId("63cf29c0bc581a02576784b3"),
            "author": "ben",
            "text": "first reply",
            "likes": ["someguy"],
            "posted": 1674521045978
        }, {
            "_id": db.objectId("63cf2a19bc581a02576784cf"),
            "parent": db.objectId("63cf29c0bc581a02576784b3"),
            "author": "someguy",
            "text": "heres a reply",
            "likes": ["ben"],
            "posted": 1674521113775
        }, {
            "_id": db.objectId("63cf2b16bc581a02576784e3"),
            "parent": db.objectId("63cf29f8bc581a02576784cb"),
            "author": "ben",
            "text": "hello",
            "likes": [],
            "posted": 1674521366855
        }, {
            "_id": db.objectId("63cf2c5cbc581a0257678503"),
            "parent": db.objectId("63cf2c42bc581a02576784f6"),
            "author": "ben",
            "text": "thanks",
            "likes": [],
            "posted": 1674521692216
        }
    ]);
}


function genTestAccessToken(user) {
    return jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET
    );
}


module.exports = { resetDbTestData, genTestAccessToken };
