# Social Media
This repos contains a social media web app, built using MERN stack libraries and frameworks.
See the app [here](https://nebji.me/).


# Backend
The backend API was coded using Express.js. The main function of the backend is to 
retrieve data requested by the frontend, from the database (MongoDB Atlas).

### index.js
Contains code for the express server

### src/middleware
Contains middleware functions, such as validating JWTs for authentication/authorization.

### src/models
Contains mongoose schemas. These schemas define the data fields for a user, post, etc.

### src/routes
Contains the routes for the backend api


# Frontend
The frontend UI was coded using React.js. It communicates with the backend using fetch.

## Components

### App
Main component, contains the frontend's routing, and gets the current user from localStorage.

### Comment
Formats data for one post comment. Handles likes, replies, edits, and deletion, and can display 
replies if the showReplies prop is true.

### Delete
Logic for a delete button, used in deleting users, posts, etc. When clicked it requires the user to
enter their username to proceed with the deletion.

### Editable
Logic for an edit button, used in editing post captions, comment/reply text. When clicked it 
displays an input tag to get the updated text.

### Home
Currently gets all posts in the database and displays them.

### Like
Logic for a like button, used on posts, comments, replies.

### Login
Displays a user login form. Logs the user in if credentials are valid, stores the encrypted token 
in localStorage.

### NavigationBar
Displays the nav bar at the top of the page, determines what items to show, and redirects, based on
if the user is logged in.

### NewPost
Form for creating a new post.

### Post
Formats data for one post, based on the view prop. Can display a list of likes, all comments, or a 
mini version of the post.

### Profile
Displays a user's profile. Can switch between showing the user's posts, followers, or following.

### ProfileEdit
Form for editing a user's profile picture, nickname, and bio. Also shows a delete button for 
deleting the account.

### ProfileMini
Displays a mini version of the profile, only showing profile picture, name, and nickname. Often 
used with the UserList component to display many profiles at once.

### Register
Form for registering a new user.

### Reply
Formats data for one reply.

### Search
Form for searching users and posts, allows to switch between user and post results.

### TextPost
Logic for a single text input form. At first displays a button, then reveals the form when clicked.
Used for posting comments and replies.

### UserList
Displays a list of ProfileMini components, used for displaying lists of followers, likes, or user 
search results.
