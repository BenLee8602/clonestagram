import React, { useState } from "react";
import { Link } from "react-router-dom";
import BigList from "./BigList";


import "../style/Search.css";
import "../style/UserList.css";
import "../style/PostList.css";


function Search() {
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const [view, setView] = useState("users");


    const handleSearch = () => {
        if (input === "") return;
        console.log(input);
        setQuery(input);
    };


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
        </div>

        <div className="search-spacer"></div>

        { query && view === "users" ? <BigList
            key={query}
            route={`users/search/${query}`}
            map={ v => <Link key={v._id} to={`/users/${v.name}/profile`} className="userlist-item">
                <img src={ v.pfp ? v.pfp : "/icons/user.png" } alt="pfp" className="userlist-item-img" />
                <div className="userlist-item-text">
                    <span className="userlist-item-nick">{ v.nick ? v.nick : v.name }</span>{' '}
                    <span className="userlist-item-name">{v.name}</span>
                </div>
            </Link> }
        /> : <></> }

        { query && view === "posts" ? <div className="postlist"><BigList
            key={query}
            route={`posts/search/${query}`}
            map={ v => <Link key={v._id} to={`/posts/${v._id}`} className="postlist-item">
                <img src={v.image} alt="post" className="postlist-image" />
            </Link> }
        /></div> : <></> }
    </div>);
}


export default Search;
