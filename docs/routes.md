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


#### query parameters


#### request headers


#### request body


#### responses


#### example


### create comment
```
POST /api/comments/:parentType/:parentId
```
creates a new comment

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### edit comment
```
PUT /api/comments/:id
```
edits the given comments text

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### delete comment
```
DELETE /api/comments/:id
```
deletes the given comment

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses



## follows
crud operations for follows

### follow a user
```
PUT /api/follows/:id
```
follows the given user, or unfollows if already following

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### get followers
```
GET /api/follows/:id/followers
```
gets a list of users who follow the given user

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### get following
```
GET /api/follows/:id/following
```
gets a list of users who are followed by the given user

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses



## likes
crud operations for likes

### like a post or comment
```
PUT /api/likes/:parentType/:parentId
```
likes the given target, or unlikes if already liked

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### get likes
```
GET /api/likes/:parentId
```
gets a list of users who have liked a given target

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses



## posts
crud operations for posts

### get all posts
```
GET /api/posts
```
gets a list of posts

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### get a post by id
```
GET /api/posts/:id
```
gets a post with the given id

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### create post
```
POST /api/posts
```
creates a new post

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### edit post
```
PUT /api/posts/:id
```
edits a posts caption

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### delete post
```
DELETE /api/posts/:id
```
deletes the given post

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses



## users
auth and crud operations for users

### register
```
POST /api/users/register
```
creates a new user

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### login
```
POST /api/users/login
```
creates a new refresh token

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### refresh login
```
POST /api/users/refresh
```
provides a new access token with the given refresh token

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### logout
```
DELETE /api/users/logout
```
deletes the given refresh token

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### search users
```
GET /api/users/search/:query
```
gets a list of users whos username includes the given query

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### get a user by name
```
GET /api/users/:name/profile
```
gets a user with the given name

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### edit user
```
PUT /api/users/profile
```
edits a users nickname, bio, or profile picture

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses


### delete user
```
DELETE /api/users/profile
```
deletes a user and all associated follows, posts, comments, and likes

#### route parameters


#### query parameters


#### request headers


#### request body


#### responses

