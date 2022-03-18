import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";

function ViewPost() {
    const id = useParams().id;
    const [post, setPost] = useState({ success: false });
    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
        .then(res => res.json())
        .then(res => setPost(res))
        .catch(err => console.log(err));
    }, [id]);

    if (!post.success) return (<div className="content"><h1>post not found</h1></div>);
    return (<div className="content">
        <Post post={post.post} />
    </div>);
}

export default ViewPost;
