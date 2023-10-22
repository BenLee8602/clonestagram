# routes
documentation for rest api endpoints found in `pixelblob/src/routes`


## comments
crud operations for comments

### get comments
```
GET /api/comments/:parentId
```

### create comment
```
POST /api/comments/:parentType/:parentId
```

### edit comment
```
PUT /api/comments/:id
```

### delete comment
```
DELETE /api/comments/:id
```


## follows
crud operations for follows

### follow a user
```
PUT /api/follows/:id
```

### get followers
```
GET /api/follows/:id/followers
```

### get following
```
GET /api/follows/:id/following
```


## likes
crud operations for likes

### like a post or comment
```
PUT /api/likes/:parentType/:parentId
```

### get likes
```
GET /api/likes/:parentId
```


## posts
crud operations for posts

### get all posts
```
GET /api/posts
```

### get a post by id
```
GET /api/posts/:id
```

### get posts by author
```
GET /api/posts/author/:name
```

### search posts by caption
```
GET /api/posts/search/:query
```

### create post
```
POST /api/posts
```

### edit post
```
PUT /api/posts/:id
```

### delete post
```
DELETE /api/posts/:id
```


## users
auth and crud operations for users

### register
```
POST /api/users/register
```

### login
```
POST /api/users/login
```

### refresh login
```
POST /api/users/refresh
```

### logout
```
DELETE /api/users/logout
```

### search users
```
GET /api/users/search/:query
```

### get a user by name
```
GET /api/users/:name/profile
```

### edit user
```
PUT /api/users/profile
```

### delete user
```
DELETE /api/users/profile
```
