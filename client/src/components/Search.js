import React, { useState } from "react";
import PostList from "./PostList";
import UserList from "./UserList";

import "../style/Search.css";


function Search() {
    const [input, setInput] = useState("");

    const [userQuery, setUserQuery] = useState("");
    const [userResults, setUserResults] = useState([]);

    const [postQuery, setPostQuery] = useState("");
    const [postResults, setPostResults] = useState([]);

    const [view, setView] = useState("users");


    const handleUserSearch = () => {
        if (input === "") return;
        setUserQuery(input);
        fetch(`${process.env.REACT_APP_BACKEND_API}/users/search/${input}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setUserResults(res.body) : console.log(res.body));
    };

    const handlePostSearch = () => {
        if (input === "") return;
        setPostQuery(input);
        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/search/${input}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setPostResults(res.body) : console.log(res.body));
    };

    const handleSearch = () => view === "users" ? handleUserSearch() : handlePostSearch();


    return (<div className="search">
        <button
            onClick={ () => setView("users") }
            className="search-switch"
            id={ view === "users" ? "search-switch-active" : "" }
        >users</button>
        <button
            onClick={ () => setView("posts") }
            className="search-switch search-switch-right"
            id={ view === "posts" ? "search-switch-active" : "" }
        >posts</button>

        <div className="search-body">
            <input
                type="text"
                placeholder={`search ${view}`}
                onChange={ e => setInput(e.target.value) }
                className="search-bar"
            />
            <button onClick={ handleSearch } className="search-button">search</button>

            { userQuery && view === "users" ? (
                userResults.length ? (
                    <UserList data={ userResults } />
                ) : (
                    <p className="no-results">No users found for "{ userQuery }"</p>
                )
            ) : <></> }
            { postQuery && view === "posts" ? (
                postResults.length ? (
                    <PostList posts={ postResults } />
                ) : (
                    <p className="no-results">No posts found for "{ postQuery }"</p>
                )
            ) : <></> }
        </div>
    </div>);
}


export default Search;
