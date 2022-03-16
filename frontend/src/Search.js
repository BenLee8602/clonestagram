import React, { useState } from "react";
import Post from "./Post";
import ProfileMini from "./ProfileMini";

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

    return (<div className="content">
        <h1>search</h1>
        <input type="text" placeholder="Enter a user or post" onChange={ e => setQuery(e.target.value) } /><br/>
        <button onClick={ handleSearch }>Search</button><br/>
        <button onClick={ () => setShow(show === "users" ? "posts" : "users") }>{ show }</button><br/>
        {
            results ? (
                show === "users" ? (
                    results.users.length ? (
                        results.users.map((v, i) => <ProfileMini key={i} user={v} />)
                    ) : (
                        <p>No users found for "{ results.query }"</p>
                    )
                ) : (
                    results.posts.length ? (
                        results.posts.map((v, i) => <Post key={i} post={v} mini />)
                    ) : (
                        <p>No posts found for "{ results.query }"</p>
                    )
                )
            ) : (<></>)
        }
    </div>);
}

export default Search;
