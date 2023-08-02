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
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Yzg2ZDJlYzA1OWRmZjhlNjJiMjg2NiIsIm5hbWUiOiJiZW4iLCJpYXQiOjE2OTA5Mjg4NDl9.NNXicoBIiLBkXSMSvh3yOs8R80AlEiXR2fFqhTPAdg0"
        }
    ],
    posts: [
        {
            _id: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            image: "post1Image",
            caption: "a cool caption",
            likeCount: 2,
            commentCount: 3
        }, {
            _id: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
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
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            text: "first comment",
            likeCount: 2,
            commentCount: 2
        }, {
            _id: new mongoose.Types.ObjectId("63cf29c8bc581a02576784b7"),
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            text: "another comment",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            author: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496"),
            text: "hi",
            likeCount: 1,
            commentCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parent: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            parentType: "post",
            author: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496"),
            text: "cool",
            likeCount: 2,
            commentCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf29d5bc581a02576784bb"),
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            text: "first reply",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2a19bc581a02576784cf"),
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            author: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496"),
            text: "heres a reply",
            likeCount: 1
        }, {
            _id: new mongoose.Types.ObjectId("63cf2b16bc581a02576784e3"),
            parent: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parentType: "comment",
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            text: "hello"
        }, {
            _id: new mongoose.Types.ObjectId("63cf2c5cbc581a0257678503"),
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            author: new mongoose.Types.ObjectId("63cf278abc581a025767848d"),
            text: "thanks"
        }
    ],
    follows: [
        {
            follower: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496"),
            following: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }
    ],
    likes: [
        {
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            likedBy: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }, {
            parent: new mongoose.Types.ObjectId("63cf287bbc581a02576784aa"),
            parentType: "post",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf2bb1bc581a02576784e8"),
            parentType: "post",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c0bc581a02576784b3"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf29c8bc581a02576784b7"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf29f8bc581a02576784cb"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }, {
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf2c42bc581a02576784f6"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }, {
            parent: new mongoose.Types.ObjectId("63cf29d5bc581a02576784bb"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf27d7bc581a0257678496")
        }, {
            parent: new mongoose.Types.ObjectId("63cf2a19bc581a02576784cf"),
            parentType: "comment",
            likedBy: new mongoose.Types.ObjectId("63cf278abc581a025767848d")
        }
    ]
}