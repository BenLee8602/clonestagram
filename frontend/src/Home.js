import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import Post, { defaultPost } from "./Post";

function Home() {
    const [user, setUser] = useContext(UserContext);
    const [allPosts, setAllPosts] = useState([defaultPost]);

    useEffect(() => {
        fetch(`http://localhost:3000`)
        .then(res => res.json())
        .then(res => setAllPosts(res))
        .catch(err => console.log(err));
    }, []);

    return (<div className="content">
        <h1>home</h1>
        { allPosts.map((v, i) => <Post key={ i } post={ v } />) }
    </div>);
}

export default Home;
