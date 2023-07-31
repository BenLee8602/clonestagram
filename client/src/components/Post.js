import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCurrentUser from "./Auth";
import BigList from "./BigList";
import Comment from "./Comment";

import "../style/Post.css";


function Post({ data }) {
    const [user, setUser] = useCurrentUser();
    const [post, setPost] = useState(null);
    const [view, setView] = useState("default");
    const [input, setInput] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => setPost({ ...data }), [data]);


    const handleLike = async () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };
        
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API}/likes/post/${post._id}`, req);
            const body = await res.json();
            if (res.status === 200) return setPost(prev => ({
                ...prev,
                liked: false,
                likeCount: prev.likeCount - 1
            }));
            if (res.status === 201) return setPost(prev => ({
                ...prev,
                liked: true,
                likeCount: prev.likeCount + 1
            }));
            console.log(body);
        } catch (err) { console.log(err); }

    };


    const handleComment = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text: input })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/post/${post._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComments([res.body, ...comments]) : console.log(res.body))
        .catch(err => console.log(err));

        setInput("");
    };


    const handleEdit = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ caption: input })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/${post._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setPost({ ...post, caption: res.body }) : console.log(res.body))
        .catch(err => console.log(err));

        setView("default");
    };


    const handleDelete = () => {
        if (input !== user) return;

        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/${post._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => setPost(null))
        .catch(err => console.log(err));
    };

    
    if (!post) return <></>;

    return (<div className="post">
        <Link to={`/posts/${post._id}`} className="post-image-link">
            <img src={ post.image } className="post-image"/>
        </Link>
        <div className="post-actions">
            <button onClick={handleLike} className={ post.liked ? "post-action-active" : "" }>
                <img src={ post.liked ? "/icons/unlike.png" : "/icons/like.png" } alt="like" />
            </button>
            <button onClick={ () => setView(view === "comment" ? "default" : "comment") || setComments([]) }>
                <img src="/icons/comment.png" alt="comment" />
            </button>
            { post.author === user ? <>
                <button onClick={ () => setView(view === "edit" ? "default" :  "edit") }>
                    <img src="/icons/edit.png" alt="edit" />
                </button>
                <button onClick={ () => setView(view === "delete" ? "default" :  "delete") }>
                    <img src="/icons/delete.png" alt="delete" />
                </button>
            </> : <></> }
        </div>
        <div className="post-body">
            { view === "default" ? <>
                <Link to={`/users/${post.author}`} className="post-author">{ post.author }</Link>
                <p className="post-sub">{ new Date(post.posted).toLocaleString() }</p>
                <p className="post-sub">{ post.likeCount }{ post.likeCount === 1 ? " like " : " likes" }</p>
                <p className="post-caption">{ post.caption }</p>
            </> : <></> }
            { view === "comment" ? <>
                <input
                    type="text"
                    placeholder="add a comment"
                    onChange={ e => setInput(e.target.value) }
                    className="post-body-input"
                />
                <button onClick={handleComment} className="post-body-button">done</button>
                <div className="post-comments">
                    { comments.map(v => <Comment key={v._id} data={v} />) }
                    <BigList
                        route={`comments/${post._id}`}
                        map={ v => <Comment key={v._id} data={v} showReplies /> }
                    />
                </div>
            </> : <></> }
            { view === "edit" ? <>
                <input
                    type="text"
                    placeholder="new caption"
                    onChange={ e => setInput(e.target.value) }
                    className="post-body-input"
                />
                <button onClick={handleEdit} className="post-body-button">done</button>
            </> : <></> }
            { view === "delete" ? <>
                <input
                    type="text"
                    placeholder="enter username to confirm"
                    onChange={ e => setInput(e.target.value) }
                    className="post-body-input"
                />
                <button onClick={handleDelete} className="post-body-button">delete</button>
            </> : <></> }
        </div>
    </div>);
}


export default Post;
