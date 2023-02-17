import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import Comment from "./Comment";

import "../style/content.css";
import "../style/Post.css";

function Post({ data }) {
    const [user, setUser] = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [view, setView] = useState("default");
    const [input, setInput] = useState("");
    const [comments, setComments] = useState(null);

    
    const id = useParams().id;
    
    useEffect(() => {
        if (!id) {
            setPost({ ...data });
            return;
        }
        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/${id}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => setPost(res.body))
        .catch(err => console.log(err));
    }, [id]);


    useEffect(() => {
        if (view !== "comment") return;
        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${post._id}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComments([...res.body]) : console.log(res.body))
        .catch(err => console.log(err));
    }, [view]);


    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };
        
        fetch(`${process.env.REACT_APP_BACKEND_API}/posts/${post._id}/like`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setPost({ ...post, likes: res.body }) : console.log(res.body))
        .catch(err => console.log(err));
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${post._id}`, req)
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
            <button onClick={handleLike} className={ post.likes.includes(user) ? "post-action-active" : "" }>
                <img src={ post.likes.includes(user) ? "/icons/unlike.png" : "/icons/like.png" } alt="like" />
            </button>
            <button onClick={ () => setView(view === "comment" ? "default" : "comment") }>
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
                <Link to={`/users/${post.author}/profile`} className="post-author">{ post.author }</Link>
                <p className="post-sub">{ new Date(post.posted).toLocaleString() }</p>
                <p className="post-sub">{ post.likes.length }{ post.likes.length === 1 ? " like " : " likes" }</p>
                <p className="post-caption">{ post.caption }</p>
            </> : <></> }
            { view === "comment" ? <>
                <input type="text" placeholder="add a comment" onChange={ e => setInput(e.target.value) } className="post-body-input" />
                <button onClick={handleComment} className="post-body-button">done</button>
                { comments ? <div className="post-comments">{ comments.map(v => <Comment key={v._id} data={v} />) }</div> : <></> }
            </> : <></> }
            { view === "edit" ? <>
                <input type="text" placeholder="new caption" onChange={ e => setInput(e.target.value) } className="post-body-input" />
                <button onClick={handleEdit} className="post-body-button">done</button>
            </> : <></> }
            { view === "delete" ? <>
                <input type="text" placeholder="enter username to confirm" onChange={ e => setInput(e.target.value) } className="post-body-input" />
                <button onClick={handleDelete} className="post-body-button">delete</button>
            </> : <></> }
        </div>
    </div>);
}

export default Post;
