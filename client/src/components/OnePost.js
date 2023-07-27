import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";

function OnePost() {
    const [post, setPost] = useState(null);
    
    const id = useParams().id;

    useEffect(() => { const fetchPost = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API}/posts/${id}`);
            const body = await res.json();
            if (res.status !== 200) return console.log(body);
            setPost(body);
        } catch (err) { console.log(err); }
    }; fetchPost(); }, [id]);

    if (!post) return <></>
    return <Post data={post} />
}

export default OnePost;
