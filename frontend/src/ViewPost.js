import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";
import UserList from "./UserList";

function ViewPost({ likes }) {
    const id = useParams().id;
    const [post, setPost] = useState({ success: false, msg: "loading" });
    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
        .then(res => res.json())
        .then(res => setPost(res))
        .catch(err => console.log(err));
    }, [id]);

    if (!post.success) return (<div className="content"><h1>{ post.msg }</h1></div>);
    if (likes) return (<div className="content">
        <Post post={post.post} mini />
        <h1>likes</h1>
        <UserList names={post.post.likes} />
    </div>);
    return (<div className="content">
        <Post post={post.post} />
    </div>);
}

export default ViewPost;
