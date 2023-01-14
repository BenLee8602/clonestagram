import React, { useEffect, useState } from "react";
import Post from "./Post";

function Home() {
    const [allPosts, setAllPosts] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_API}/posts`)
        .then(res => res.json())
        .then(res => setAllPosts(res))
        .catch(err => console.log(err));
    }, []);

    if (!allPosts) return <h1 className="tile padded">loading</h1>
    return <>{ allPosts.map((v, i) => <Post key={ i } data={ v } />) }</>;
}

export default Home;
