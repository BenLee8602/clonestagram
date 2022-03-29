import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Post from "./Post";
import UserList from "./UserList";

function ViewPost({ view }) {
    const id = useParams().id;
    const [post, setPost] = useState({ success: false, msg: "loading" });
    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
        .then(res => res.json())
        .then(res => setPost(res))
        .catch(err => console.log(err));
    }, [id]);

    if (!post.success) return (<div className="content"><h1>{ post.msg }</h1></div>);

    if (view === "likes") return (<div className="content">
        <Post post={post.post} mini />
        <h1>likes</h1>
        <UserList names={post.post.likes} />
    </div>);

    if (view === "comments") return (<div className="content">
        <Post post={post.post} mini />
        <h1>comments</h1>
        { post.post.comments.map((v, i) => <Comment key={i} comment={v} />) }
    </div>);

    return (<div className="content">
        <Post post={post.post} />
    </div>);
}

export default ViewPost;
