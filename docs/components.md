# components
documentation for react components found in `pixelblob/client/src/components`


## app
top level component containing the apps frontend routes


## auth/usecurrentuser
custom hook for reading and modifying the current user. returns an array where
- first element is an object containing the current users id and name (keys are `id` and `name`)
- second element is a function used to modify the current user object

### example
```js
const [user, setUser] = useCurrentUser();
```


## auth/requirelogin
component for restricting access to routes, allowing only logged in users. navigates to login page if unauthorized

### example
```jsx
<BrowserRouter>
    <Routes>
        <Route path="/unprotected-route" element={ <Component1/> } />
        <Route element={ <RequireLogin/> }>
            <Route path="/protected-route-1" element={ <Component2/> } />
            <Route path="/protected-route-2" element={ <Component3/> } />
        </Route>
    </Routes>
</BrowserRouter>
```


## auth/currentuser
acts as a context provider for the current user. ensures that the current user information has been fetched from the backend before any child components try to access it.

### example
```jsx
<BrowserRouter>
    <CurrentUser>
        <Routes>
            <Route path="/route-requires-user-1" element={ <Component1/> } />
            <Route path="/route-requires-user-2" element={ <Component2/> } />
        </Routes>
    </CurrentUser>
</BrowserRouter>
```


## biglist
generic component used for handling large collections of records using pagination. implements an infinite scroll functionality using javascripts built in `IntersectionObserver` class. when a user scrolls to the bottom of the component, it will automatically fetch the next page of records from the specified rest api endpoint. returns all records mapped to a specified component

### props
- `route` backend route to fetch from. remember to define `process.env.REACT_APP_BACKEND_API` in `pixelblob/client/.env`
- `req` request object to be sent to backend, can include http method, headers, content type, etc (default=`undefined`)
- `map` function to transform backend response into react components
- `container` dom element to check for intersections, used by intersection observer (default=`null`)

### example
```jsx
function BigListExample() {
    const targetRef = useRef(null)

    const req = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({ msg: "hello" })
    };

    return <div ref={targetRef}>
        <Biglist
            route="api/route/to/fetch/from"
            req={ req }
            map={ v => <Record key={v._id} data={v} /> }
            container={ targetRef.current }
        />
    </div>
}
```


## comment
displays a single comment or reply. displays the authors info, comment text, and buttons to like and reply. allows the user to edit and delete the comment if they are the author.

### props
- `data` object containing the comment information. see example for keys and types. you can get comment objects in this format using the `GET /api/comments/:commentId` endpoint
- `showReplies` boolean that decides if replies are rendered. should be true if its a comment and not a reply

### example
```jsx
function CommentExample() {
    const comment = {
        _id: "64cac1679c37e83d55a99996",
        parent: "64cab76100f25d5cab64f2e8",
        parentType: "post",
        author: {
            _id: "64c9e0a369d3c90fe8a10002",
            name: "ben2",
            pfp: "",
            nick: "also ben"
        },
        text: "helloooo",
        likeCount: 0,
        commentCount: 0,
        posted: "2023-08-02T20:49:43.479Z"
    };

    return <Comment data={comment} showReplies />
}
```

## home
simply returns a feed of posts using `BigList`


## likes
displays a list of users that have liked a specified target (given by route parameter `id`)  

### route parameters
- `id` object id of the target to display likes for

### example
```jsx
<Route path="/likes/:id" element={ <Likes/> } />
```

## login
displays the login form. sends the username and password to the backend on submit, and updates the current user context accordingly using the `useCurrentUser` custom hook


## navigationbar
displays the navigation bar. contains the logout functionality. displays links for home, profile, search, new, logout, login, register


## newpost
displays the form for creating a new post


## onepost
fetches a single post, given by route parameter `id`, and displays it

### route parameters
- `id` object id of the post to display

### example
```jsx
<Route path="/posts/:id" element={ <OnePost/> } />
```


## post
displays a posts image, caption, and ui for liking, commenting, etc

### props
- `data` object containing the post information. see example for keys and types. you can get post objects in this format using the `GET /api/posts` endpoint

### example
```jsx
function PostExample() {
    const post = {
        _id: '63cf287bbc581a02576784aa',
        author: {
            _id: '63cf278abc581a025767848d',
            name: 'ben',
            pfp: 'linkToBensProfilePicture',
            nick: 'benjamin'
        },
        image: 'linkToPost1Image',
        caption: 'a cool caption',
        likeCount: 2,
        commentCount: 3,
        liked: true
    };

    return <Post data={post} />
}
```


## profile
displays a users profile, including name, nickname, bio, profile picture, follower/following/posts count, and more

### route parameters
- `name` name of the user to display

### example
```jsx
<Route path="/users/:name" element={ <Profile/> } />
```


## profileedit
displays the form for editing a users profile information, including nickname, bio, and profile picture


## register
displays the form for registering a new user account


## search
displays the form for searching for users and posts, and the results of the search


## user
displays basic user info including name, nickname, and profile picture. usually used to display one record in a list of users

### props
- `user` an object containing the users info, should include `name`, `nick`, and `pfp` fields
- `i` the index of this user if in a list. used for style

### example
```jsx
function UserExample() {
    const users = [{
        _id: "63cf278abc581a025767848d",
        name: "user1",
        pfp: "linkToUser1ProfilePicture",
        nick: "ben"
    }, {
        _id: "63cf27d7bc581a0257678496",
        name: "user2",
        pfp: "",
        nick: "neb"
    }];

    return <>
        { users.map((v, i) => <User key={v._id} user={v} i={i} />) }
    </>
}
```
