import React, { useState } from "react";
import PostList from "./PostList";
import UserList from "./UserList";

import "../style/Search.css";

function Search() {
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState("users");

    const handleSearch = () => {
        if (input === "") return;
        setQuery(input);
        
        fetch(`${process.env.REACT_APP_BACKEND_API}/users/search/${input}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setUsers(res.body) : console.log(res.body));

        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/search/${input}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setPosts(res.body) : console.log(res.body));
    };

    return (<>
        <div className="search">
            <input
                type="text"
                placeholder="search users and posts"
                onChange={ e => setInput(e.target.value) }
                className="search-bar"
            />
            <button onClick={ handleSearch } className="search-button">search</button>
        </div>
        
        { query ? <>
            <div className="search">
                <button
                    onClick={ () => setShow("users") }
                    className="search-switch"
                    id={ show === "users" ? "search-switch-active" : "" }
                >users</button>
                <button
                    onClick={ () => setShow("posts") }
                    className="search-switch"
                    id={ show === "posts" ? "search-switch-active" : "" }
                >posts</button>
            </div>

            { show === "users" ? (
                users.length ? <UserList data={ users } /> : <h3>No users found for "{ query }"</h3>
            ) : (
                posts.length ? <PostList posts={ posts } /> : <h3>No posts found for "{ query }"</h3>
            ) }
        </> : <></> }
    </>);
}

export default Search;
