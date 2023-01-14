import React, { useEffect, useState } from "react";
import Post from "./Post";

function Home() {
    const [allPosts, setAllPosts] = useState(null);
    const [msg, setMsg] = useState("loading");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_API}/posts`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status === 200) return setAllPosts([...res.body]);
            setMsg("an error occured");
            console.log(res.body);
        })
        .catch(err => console.log(err));
    }, []);

    if (!allPosts) return <h1 className="tile padded">{ msg }</h1>
    return <>{ allPosts.map((v, i) => <Post key={ i } data={ v } />) }</>;
}

export default Home;
