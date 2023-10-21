# schemas
documentation for database schemas found in `pixelblob/src/models`


## comment
represents a comment on a post, or a reply to a comment
- `parent` an object id referencing a post, or another comment (required, immutable)
- `parentType` a string telling if the parent is a post or comment (required, immutable)
- `author` an object id referencing the user who created the comment (required, immutable)
- `posted` the datetime when the comment was posted (required, immutable, default=`Date.now()`)
- `text` a string containing the comment contents (required)
- `likeCount` an integer telling the number of users who liked this comment (default=`0`)
- `commentCount` an integer telling the number of replies on this comment (default=`0`)


## follow
represents a user currently following another user
- `created` the datetime when one user began following another (required, immutable, default=`Date.now()`)
- `follower` an object id referencing the user who is following another (required, immutable)
- `following` an object id referencing the user who is being followed (required, immutable)


## like
represents a user liking a post, comment, or reply
- `created` the datetime when the like was created (required, immutable, default=`Date.now()`)
- `parent` an object id referencing the target of the like (required, immutable)
- `parentType` a string telling if the parent is a post or comment (required, immutable)
- `likedBy` an object id referencing the user who created the like (required, immutable)


## post
- `author` an object id referencing the user who created the post (required, immutable)
- `posted` the datetime when the post was created (required, immutable, default=`Date.now()`)
- `image` a string telling the filename of the image in the aws s3 bucket (required, immutable)
- `caption` a string containing the image caption (required)
- `likeCount` an integer telling the number of users who liked this post (default=`0`)
- `commentCount` an integer telling the number of replies on this post (default=`0`)


## token
- `token` a string representing a users refresh token as a jwt (required, unique, immutable)


## user
- `name` a string containing the users name (required, unique, immutable)
- `pass` a string containing the users password hash (required)
- `pfp` a string telling the filename of the users profile picture in the aws s3 bucket (default=`""`)
- `nick` a string containing the users nickname (default=`""`)
- `bio` a string containing the users biography (default=`""`)
- `postCount` an integer telling the number of posts this user has created (default=`0`)
- `followerCount` an integer telling the number of users who follow this user (default=`0`)
- `followingCount` an integer telling the number of users who are followed by this user (defualt=`0`)
