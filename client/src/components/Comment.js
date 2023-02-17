import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import Reply from "./Reply";

import "../style/Comment.css";


function Comment({ data }) {
    const [user, setUser] = useContext(UserContext);
    const [comment, setComment] = useState(null);
    const [replies, setReplies] = useState(null);
    const [view, setView] = useState(null);
    const [input, setInput] = useState("");


    useEffect(() => setComment({ ...data }), [data]);

    useEffect(() => {
        if (view !== "reply") return;
        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${comment._id}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReplies([...res.body]) : console.log(res.body))
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
        
        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}/like`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComment({ ...comment, likes: res.body }) : console.log(res.body))
        .catch(err => console.log(err));
    };


    const handleReply = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text: input })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReplies([res.body, ...replies]) : console.log(res.body))
        .catch(err => console.log(err));

        setView(null);
    };


    const handleEdit = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text: input })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComment({ ...res.body }) : console.log(res.body))
        .catch(err => console.log(err));

        setView(null);
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComment(null) : console.log(res.body))
        .catch(err => console.log(err));
    };


    if (!comment) return <></>;
    
    if (view === "reply") return (<div className="comment-modify">
        <input type="text" placeholder="new reply" onChange={ e => setInput(e.target.value) } />
        <button onClick={ () => setView(null) }>✕</button>
        <button onClick={handleReply}>✓</button>
        { replies ? <div className="comment-replies">{ replies.map(v => <Reply key={v._id} data={v} />) }</div> : <></> }
    </div>);

    if (view === "edit") return (<div className="comment-modify">
        <input type="text" placeholder="new comment text" onChange={ e => setInput(e.target.value) } />
        <button onClick={ () => setView(null) }>✕</button>
        <button onClick={handleEdit}>✓</button>
    </div>);

    if (view === "delete") return (<div className="comment-modify">
        <input type="text" placeholder="enter username to confirm" onChange={ e => setInput(e.target.value) } />
        <button onClick={ () => setView(null) }>✕</button>
        <button onClick={handleDelete}>✓</button>
    </div>);

    return (<div className="comment">
        <div className="comment-body">
            <Link to={`/users/${comment.author}/profile`} className="comment-author">{ comment.author }</Link>
            <span className="comment-date">{ new Date(comment.posted).toLocaleString() }</span><br/>
            { comment.text }
        </div>
        <div className="comment-actions">
            <span className="comment-likes-count">{ comment.likes.length }</span>
            <button onClick={handleLike} className={ comment.likes.includes(user) ? "comment-action-active" : "" }>
                <img src={ comment.likes.includes(user) ? "/icons/unlike.png" : "/icons/like.png" } alt="like" />
            </button>
            <button onClick={ () => setView("reply") }><img src="/icons/comment.png" alt="comment" /></button>
            { comment.author === user ? <>
                <button onClick={ () => setView("edit") }><img src="/icons/edit.png" alt="edit" /></button>
                <button onClick={ () => setView("delete") }><img src="/icons/delete.png" alt="delete" /></button>
            </> : <></> }
        </div>
    </div>);
}

export default Comment;


