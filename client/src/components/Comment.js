import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCurrentUser from "./Auth";

import BigList from "./BigList";

import "../style/Comment.css";
import "../style/Reply.css";


function Comment({ data, showReplies }) {
    const [user, setUser] = useCurrentUser();
    const [comment, setComment] = useState(null);
    const [replies, setReplies] = useState([]);
    const [view, setView] = useState("default");
    const [input, setInput] = useState("");

    useEffect(() => setComment({ ...data }), [data]);


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

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReplies([res.body, ...replies]) : console.log(res.body))
        .catch(err => console.log(err));
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComment(null) : console.log(res.body))
        .catch(err => console.log(err));
    };


    if (!comment) return (<></>);

    return (<div className={ showReplies ? "comment" : "reply" }>
        <div className="comment-body">
            <Link to={`/users/${comment.author}/profile`} className="comment-author">{ comment.author }</Link>
            <span className="comment-date">{ new Date(comment.posted).toLocaleString() }</span><br/>
            { comment.text }
        </div>

        { view === "default" ? <div className="comment-actions">
            <span className="comment-likes-count">{ comment.likes.length }</span>
            <button onClick={handleLike} className={ comment.likes.includes(user) ? "comment-action-active" : "" }>
                <img src={ comment.likes.includes(user) ? "/icons/unlike.png" : "/icons/like.png" } alt="like" />
            </button>
            { showReplies ? <button onClick={ () => setView("reply") }><img src="/icons/comment.png" alt="comment" /></button> : <></> }
            { comment.author === user ? <>
                <button onClick={ () => setView("edit") }><img src="/icons/edit.png" alt="edit" /></button>
                <button onClick={ () => setView("delete") }><img src="/icons/delete.png" alt="delete" /></button>
            </> : <></> }
        </div> : <></> }
        { view === "reply" ? <>
            <div className="comment-actions">
                <input type="text" placeholder="new reply" onChange={ e => setInput(e.target.value) } />
                <button onClick={ () => setView("default") || setReplies([]) }>✕</button>
                <button onClick={handleReply}>✓</button>
            </div>
            <div className="comment-replies">
                { replies ? <>{ replies.map(v => <Comment key={v._id} data={v} />) }</> : <></> }
                <BigList
                    route={`comments/${comment._id}`}
                    map={ v => <Comment key={v._id} data={v} /> }
                />
            </div>
        </> : <></> }
        { view === "edit" ? <div className="comment-actions">
            <input type="text" placeholder="new comment text" onChange={ e => setInput(e.target.value) } />
            <button onClick={ () => setView("default") }>✕</button>
            <button onClick={handleEdit}>✓</button>
        </div> : <></> }
        { view === "delete" ? <div className="comment-actions">
            <input type="text" placeholder="enter username to confirm" onChange={ e => setInput(e.target.value) } />
            <button onClick={ () => setView("default") }>✕</button>
            <button onClick={handleDelete}>✓</button>
        </div> : <></> }
    </div>);
}

export default Comment;


