const mongoose = require("mongoose");

module.exports = {
    users: [
        {
            _id: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            name: "ben",
            pass: "$2b$10$4hBzoLGNiIN7STLo.Uuln.XHX3MaDJt2xd6m610uTLh6NV4pRB0Cm",
            pfp: "bensProfilePicture",
            nick: "benjamin",
            bio: "hi my name is ben",
            postCount: 2,
            followerCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496"),
            name: "someguy",
            pass: "$2b$10$q9AWwrNN5RZO0qi5DPtp4OSBtXddkw510qC88i4JaY5NznJPb1B/C",
            pfp: "",
            nick: "awesome nickname",
            bio: "awesome bio",
            followingCount: 1
        }
    ],
    tokens: [
        {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYmVuIiwiaWF0IjoxNjc0NjcyOTE3fQ._u36cNgDORuYRI10_02PECE5Eacl-vm3co5fKD3QPgA"
        }
    ],
    posts: [
        {
            _id: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            author: "ben",
            image: "post1Image",
            caption: "a cool caption",
            likeCount: 2,
            commentCount: 3
        }, {
            _id: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            author: "ben",
            image: "post2Image",
            caption: "cccc",
            likeCount: 1,
            commentCount: 1
        }
    ],
    comments: [
        {
            _id: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            author: "ben",
            text: "first comment",
            likeCount: 2,
            commentCount: 2
        }, {
            _id: new mongoose.Types.ObjectId("63cf29c8bc581a02576784b7"),
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            author: "ben",
            text: "another comment",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            author: "someguy",
            text: "hi",
            likeCount: 1,
            commentCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parent: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            parentType: "post",
            author: "someguy",
            text: "cool",
            likeCount: 2,
            commentCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf29d5bc581a02576784bb"),
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            author: "ben",
            text: "first reply",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2a19bc581a02576784cf"),
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            author: "someguy",
            text: "heres a reply",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2b16bc581a02576784e3"),
            parent: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parentType: "comment",
            author: "ben",
            text: "hello"
        }, {
            _id: new mongoose.Types.ObjectId("63cf2c5cbc581a0257678503"),
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            author: "ben",
            text: "thanks"
        }
    ],
    follows: [
        {
            follower: "someguy",
            following: "ben"
        }
    ],
    likes: [
        {
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            likedBy: "ben"
        }, {
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            parentType: "post",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            likedBy: "ben"
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c8bc581a02576784b7"),
            parentType: "comment",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parentType: "comment",
            likedBy: "ben"
        }, {
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            likedBy: "ben"
        }, {
            parent: new mongoose.Types.ObjectId("63cf29d5bc581a02576784bb"),
            parentType: "comment",
            likedBy: "someguy"
        }, {
            parent: new mongoose.Types.ObjectId("63cf2a19bc581a02576784cf"),
            parentType: "comment",
            likedBy: "ben"
        }
    ]
}