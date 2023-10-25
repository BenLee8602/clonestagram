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

#### query parameters
- `authorization` string containing a users access token in the format `Bearer ${token}`

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `400` parent type is not one of `post` or `comment`
- `404` parent is not found
- `200` current user has unliked target
- `201` current user has liked target

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

#### responses
- `401` access token is missing or invalid
- `403` access token is expired
- `200` user profile has been updated


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
