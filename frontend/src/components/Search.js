import React, { useState } from "react";
import Post from "./Post";
import ProfileMini from "./ProfileMini";
import "../style/Search.css";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [show, setShow] = useState("users");

    const handleSearch = () => {
        if (query === "") return;
        fetch(`http://localhost:3000/search/${query}`)
        .then(res => res.json())
        .then(res => setResults(res));
    };

    return (<>
        <div id="search" className="tile padded">
            <h1>search</h1>
            <input id="bar" type="text" placeholder="Enter a user or post" onChange={ e => setQuery(e.target.value) } />
            <button id="go" className="active" onClick={ handleSearch }>Search</button><br/>
            <button
                className={ show === "users" ? "active" : "" }
                id="showUsers"
                onClick={ () => setShow("users") }
            >users</button>
            <button
                className={ show === "posts" ? "active" : "" }
                id="showPosts"
                onClick={ () => setShow("posts") }
            >posts</button>
        </div>
        {
            results ? (
                show === "users" ? (
                    results.users.length ? (
                        results.users.map((v, i) => <ProfileMini key={i} user={v} />)
                    ) : (
                        <h3 id="search" className="tile padded">No users found for "{ results.query }"</h3>
                    )
                ) : (
                    results.posts.length ? (
                        results.posts.map((v, i) => <Post key={i} data={v} view="mini" />)
                    ) : (
                        <h3 id="search" className="tile padded">No posts found for "{ results.query }"</h3>
                    )
                )
            ) : (<></>)
        }
    </>);
}

export default Search;
