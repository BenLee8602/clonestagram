import React, { useState } from "react";
import PostList from "./PostList";
import UserList from "./UserList";

import "../style/Search.css";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [show, setShow] = useState("users");

    const handleSearch = () => {
        if (query === "") return;
        fetch(`${process.env.REACT_APP_BACKEND_API}/search/${query}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setResults(res.body) : console.log(res.body));
    };

    return (<>
        <div className="search">
            <input
                type="text"
                placeholder="search users and posts"
                onChange={ e => setQuery(e.target.value) }
                className="search-bar"
            />
            <button onClick={ handleSearch } className="search-button">search</button>
        </div>
        
        { results ? <>
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
                results.users.length ? <UserList data={ results.users } /> : <h3>No users found for "{ results.query }"</h3>
            ) : (
                results.posts.length ? <PostList posts={ results.posts } /> : <h3>No posts found for "{ results.query }"</h3>
            ) }
        </> : <></> }
    </>);
}

export default Search;
