# routes
documentation for rest api endpoints found in `pixelblob/src/routes`


## comments
crud operations for comments

### get comments
```
GET /api/comments/:parentId
```
gets a list of comments with the given parent

#### route parameters
- `parentId` the object id of the comments parent

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)
- `cur` object id of the currently logged in user (default=`null`)

#### responses
- `200` returns an array of comment objects

#### example
fetch data
```js
async function example() {
    try {
        const route = "http://localhost:3000/api/comments/63cf287bbc581a02576784aa";
        const url = route + "?page=2&start=1698270621452&cur=63cf278abc581a025767848d";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "63cf29c0bc581a02576784b3",
        "parent": "63cf287bbc581a02576784aa",
        "parentType": "post",
        "author": {
            "_id": "63cf278abc581a025767848d",
            "name": "user1",
            "pfp": "",
            "nick": "awesome nickname"
        },
        "text": "first comment",
        "likeCount": 2,
        "commentCount": 2,
        "posted": "2023-10-26T01:08:07.303Z",
        "liked": true
    }, {
        "_id": "63cf29c8bc581a02576784b7",
        "parent": "63cf287bbc581a02576784aa",
        "parentType": "post",
        "author": {
            "_id": "63cf278abc581a025767848d",
            "name": "user1",
            "pfp": "",
            "nick": "awesome nickname"
        },
        "text": "another comment",
        "likeCount": 1,
        "posted": "2023-10-26T01:08:07.303Z",
        "liked": false
    }, {
        "_id": "63cf29f8bc581a02576784cb",
        "parent": "63cf287bbc581a02576784aa",
        "parentType": "post",
        "author": {
            "_id": "63cf27d7bc581a0257678496",
            "name": "user2",
            "pfp": "linkToUser2ProfilePicture",
            "nick": "second user"
        },
        "text": "hi",
        "likeCount": 1,
        "commentCount": 1,
        "posted": "2023-10-26T01:08:07.303Z",
        "liked": true
    }
]
```


### create comment
```
POST /api/comments/:parentType/:parentId
```
creates a new comment

#### route parameters
- `parentType` type of the comments parent, either `post` or `comment`
- `parentId` object id of the comments parent

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### request body
- `text` string containing the new comments text

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` comment text is missing from the request body
- `400` parent type is not `post` or `comment`
- `404` parent is not found
- `400` parent is a reply (parent is a comment, whos parent is also a comment)
- `200` returns the newly created comment

#### example
fetch data
```js
async function example() {
    const req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({ text: "hi" })
    };

    try {
        const url = "http://localhost:3000/api/comments/post/63cf287bbc581a02576784aa";
        const res = await fetch(url, req);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "_id": "6539c693f03be57df248258f",
    "parent": "63cf287bbc581a02576784aa",
    "parentType": "post",
    "author": {
        "_id": "63cf278abc581a025767848d",
        "name": "ben",
        "pfp": "linkToBensProfilePicture",
        "nick": "benjamin"
    },
    "text": "brand new comment",
    "posted": "2023-10-26T01:53:23.587Z",
    "likeCount": 0,
    "commentCount": 0
}
```


### edit comment
```
PUT /api/comments/:id
```
edits the given comments text

#### route parameters
- `id` object id of the comment to edit

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### request body
- `text` the updated comment text

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` text is missing from the request body
- `404` comment is not found
- `200` comment text has been updated

#### example
fetch data
```js
async function example() {
    const req = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({ text: "updated comment text" })
    };

    try {
        const url = "http://localhost:3000/api/comments/63cf29c0bc581a02576784b3";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```

### delete comment
```
DELETE /api/comments/:id
```
deletes the given comment

#### route parameters
- `id` object id of the comment to delete

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `404` comment is not found
- `200` comment has been deleted

#### example
fetch data
```js
async function example() {
    const req = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    try {
        const url = "http://localhost:3000/api/comments/1d42dba5a242fae43db013ff";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```


## follows
crud operations for follows

### follow a user
```
PUT /api/follows/:id
```
follows the given user, or unfollows if already following

#### route parameters
- `id` the object id of the user to be followed

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` users cannot follow themselves (user provided by header `authorization` is the same as route param `id`)
- `404` other user is not found
- `200` current user has unfollowed other user
- `201` current user has began following other user

#### example
fetch data
```js
async function example() {
    const req = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    try {
        const url = "http://localhost:3000/api/follows/63cf27d7bc581a0257678496";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
201
```

### get followers
```
GET /api/follows/:id/followers
```
gets a list of users who follow the given user

#### route parameters
- `id` object id of the user to fetch followers from

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)

#### responses
- `200` returns a list of followers for the given user

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/follows/922375f85c0d1971cbc424cf/followers";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "63cf278abc581a025767848d",
        "name": "ben",
        "pfp": "linkToBensProfilePicture",
        "nick": "benjamin"
    }, {
        "_id": "63cf27d7bc581a0257678496",
        "name": "user1",
        "pfp": "",
        "nick": ""
    }
]
```

### get following
```
GET /api/follows/:id/following
```
gets a list of users who are followed by the given user

#### route parameters
- `id` object id of the user to fetch following from

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)

#### responses
- `200` returns a list of users followed by the given user

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/follows/63cf27d7bc581a0257678496/following";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "922375f85c0d1971cbc424cf",
        "name": "user2",
        "pfp": "",
        "nick": "second user"
    }
]
```


## likes
crud operations for likes

### like a post or comment
```
PUT /api/likes/:parentType/:parentId
```
likes the given target, or unlikes if already liked

#### route parameters
- `parentType` type of the likes target (`post` or `comment`)
- `parentId` object id of the target

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` parent type is not one of `post` or `comment`
- `404` parent is not found
- `200` current user has unliked target
- `201` current user has liked target

#### example
fetch data
```js
async function example() {
    const req = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    try {
        const url = "http://localhost:3000/api/likes/comment/63cf29d5bc581a02576784bb";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
201
```

### get likes
```
GET /api/likes/:parentId
```
gets a list of users who have liked a given target

#### route parameters
- `parentId` object id of the target to fetch likes from

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)

#### responses
- `200` returns a list of likes with the given target

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/likes/63cf29c0bc581a02576784b3";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "63cf278abc581a025767848d",
        "name": "ben",
        "pfp": "linkToBensProfilePicture",
        "nick": "benjamin"
    }, {
        "_id": "63cf27d7bc581a0257678496",
        "name": "someguy",
        "pfp": "",
        "nick": "awesome nickname"
    }
]
```


## posts
crud operations for posts

### get posts
```
GET /api/posts
```
gets a list of posts

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)
- `cur` object id of the currently logged in user (default=`null`)

#### responses
- `200` returns a list of posts

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/posts?cur=63cf278abc581a025767848d";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "63cf2bb1bc581a02576784e8",
        "author": {
            "_id": "63cf278abc581a025767848d",
            "name": "ben",
            "pfp": "linkToBensProfilePicture",
            "nick": "benjamin"
        },
        "image": "linkToPost2Image",
        "caption": "cccc",
        "likeCount": 1,
        "commentCount": 1,
        "posted": "2023-10-26T17:49:55.479Z",
        "liked": false
    }, {
        "_id": "63cf287bbc581a02576784aa",
        "author": {
            "_id": "63cf278abc581a025767848d",
            "name": "ben",
            "pfp": "linkToBensProfilePicture",
            "nick": "benjamin"
        },
        "image": "linkToPost1Image",
        "caption": "a cool caption",
        "likeCount": 2,
        "commentCount": 3,
        "posted": "2023-10-26T17:49:55.478Z",
        "liked": true
    }
]
```

### get a post by id
```
GET /api/posts/:id
```
gets a post with the given id

#### route parameters
- `id` object id of the post to fetch

#### query parameters
- `cur` object id of the currently logged in user (default=`null`)

#### responses
- `404` post is not found
- `200` returns the requested post

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/posts/63cf287bbc581a02576784aa";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "_id": "63cf287bbc581a02576784aa",
    "author": {
        "_id": "63cf278abc581a025767848d",
        "name": "ben",
        "pfp": "linkToBensProfilePicture",
        "nick": "benjamin"
    },
    "image": "linkToPost1Image",
    "caption": "a cool caption",
    "likeCount": 2,
    "commentCount": 3,
    "posted": "2023-10-26T17:49:55.478Z",
    "liked": false
}
```

### create post
```
POST /api/posts
```
creates a new post

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### request body
- `caption` caption for the new post (default=`""`)

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `200` returns the new post

#### example
fetch data
```js
async function example(image, caption) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    const req = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: formData
    };

    try {
        const url = "http://localhost:3000/api/posts";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```


### edit post
```
PUT /api/posts/:id
```
edits a posts caption

#### route parameters
- `id` object id of the post to edit

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### request body
- `caption` new caption for the post

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` new caption missing from request body
- `404` post with the given id not found
- `200` post has been updated

#### example
fetch data
```js
async function example() {
    const req = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({ caption: "updated caption" })
    };

    try {
        const url = "http://localhost:3000/api/posts/63cf287bbc581a02576784aa";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```


### delete post
```
DELETE /api/posts/:id
```
deletes the given post

#### route parameters
- `id` object id of the post to delete

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `404` post with the given id not found
- `200` post has been deleted

#### example
fetch data
```js
async function example() {
    const req = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    try {
        const url = "http://localhost:3000/api/posts/63cf287bbc581a02576784aa";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```

## users
auth and crud operations for users

### register
```
POST /api/users/register
```
creates a new user

#### request body
- `name` name for the new user
- `pass` password for the new user

#### responses
- `400` name or pass is missing from request body
- `409` name is already taken by an existing user
- `200` returns an access token, refresh token, and user info

#### example
fetch data
```js
async function example() {
    const req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "ben2", pass: "secret" })
    };

    try {
        const url = "http://localhost:3000/api/users/register";
        const res = await fetch(url, req);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "refreshToken": "this.is.an.example.refresh.token",
    "accessToken": "this.is.an.example.access.token",
    "user": { "id": "653aaec64886de335a4407d7", "name": "ben2" }
}
```

### login
```
POST /api/users/login
```
creates a new refresh token

#### request body
- `name` user to login as
- `pass` password to authenticate user

#### responses
- `400` name or pass is missing from request body
- `404` no user found with the given name
- `401` password is incorrect
- `200` returns an access token, refresh token, and user info

#### example
fetch data
```js
async function example() {
    const req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "ben2", pass: "secret" })
    };

    try {
        const url = "http://localhost:3000/api/users/login";
        const res = await fetch(url, req);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "refreshToken": "this.is.an.example.refresh.token",
    "accessToken": "this.is.an.example.access.token",
    "user": { "id": "653aaec64886de335a4407d7", "name": "ben2" }
}
```

### refresh login
```
POST /api/users/refresh
```
provides a new access token with the given refresh token

#### request body
- `refreshToken` jwt used to authenticate user and generate new access token

#### responses
- `400` refresh token is missing from request body
- `401` refresh token is invalid or old
- `200` returns a new access token and user info

#### example
fetch data
```js
async function example() {
    const req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
    };

    try {
        const url = "http://localhost:3000/api/users/refresh";
        const res = await fetch(url, req);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "accessToken": "this.is.an.example.access.token",
    "user": { "id": "653aaec64886de335a4407d7", "name": "ben2" }
}
```

### logout
```
DELETE /api/users/logout
```
deletes the given refresh token

#### request body
- `refreshToken` refresh token to deactivate (remove from tokens collection)

#### responses
- `400` refresh token is missing from request body
- `404` refresh token is not found in collection of active tokens
- `200` user has been logged out, refresh token deactivated

#### example
fetch data
```js
async function example() {
    const req = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
    };

    try {
        const url = "http://localhost:3000/api/users/logout";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```

### search users
```
GET /api/users/search/:query
```
gets a list of users whos username includes the given query

#### route parameters
- `query` username (or partial) to search for

#### query parameters
- `page` zero-indexed integer of the current page (default=`0`)
- `start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response (default=`new Date()`)

#### responses
- `200` returns list of users whos name matches query

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/users/search/be";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
[
    {
        "_id": "63cf278abc581a025767848d",
        "name": "ben",
        "pfp": "linkToBensProfilePicture",
        "nick": "benjamin",
        "bio": "hi my name is ben",
        "postCount": 2,
        "followerCount": 1,
        "followingCount": 0
    }
]
```

### get a user by name
```
GET /api/users/:name/profile
```
gets a user with the given name

#### route parameters
- `name` name of the user to fetch

#### query parameters
- `cur` object id of the currently logged in user (default=`null`)

#### responses
- `400` user with the given name is not found
- `200` returns the given user

#### example
fetch data
```js
async function example() {
    try {
        const url = "http://localhost:3000/api/users/ben/profile?cur=63cf27d7bc581a0257678496";
        const res = await fetch(url);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "_id": "63cf278abc581a025767848d",
    "name": "ben",
    "pfp": "linkToBensProfilePicture",
    "nick": "benjamin",
    "bio": "hi my name is ben",
    "postCount": 2,
    "followerCount": 1,
    "followingCount": 0,
    "following": true
}
```

### edit user
```
PUT /api/users/profile
```
edits a users nickname, bio, or profile picture

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### request body
- `nick` new nickname for the user (default=`""`)
- `bio` new bio for the user (default=`""`)
- `pfp` new profile picture for the user (default=`null`)

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `200` user profile has been updated

#### example
fetch data
```js
async function example(pfp, nick, bio) {
    const formData = new FormData();
    formData.append("image", pfp);
    formData.append("nick", nick);
    formData.append("bio", bio);
    
    const req = {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: formData
    };

    try {
        const url = "http://localhost:3000/api/users/profile";
        const res = await fetch(url, req);
        const body = await res.json();
        console.log(body);
    } catch (err) { console.log(err); }
}
```

output
```json
{
    "name": "ben",
    "pfp": "linkToBrandNewProfilePicture",
    "nick": "brand new nickname",
    "bio": "brand new bio",
    "postCount": 0,
    "followerCount": 0,
    "followingCount": 1
}
```


### delete user
```
DELETE /api/users/profile
```
deletes a user and all associated follows, posts, comments, and likes

#### request headers
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `200` user and associated posts, comments, follows, likes have been deleted

#### example
fetch data
```js
async function example() {
    const req = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    try {
        const url = "http://localhost:3000/api/users/profile";
        const res = await fetch(url, req);
        console.log(res.status);
    } catch (err) { console.log(err); }
}
```

output
```
200
```
