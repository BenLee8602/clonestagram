import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import Reply from "./Reply";
import Delete from "./Delete";
import Editable from "./Editable";
import Like from "./Like";
import TextPost from "./TextPost";
import "../style/Comment.css";

function Comment({ commentProp }) {
    const [user, setUser] = useContext(UserContext);
    const [comment, setComment] = useState(null);
    const [replies, setReplies] = useState(null);

    useEffect(() => setComment({ ...commentProp }), [commentProp]);

    const getReplies = () => {
        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${comment._id}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReplies([...res.body]) : console.log(res.body))
        .catch(err => console.log(err));
    };

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
        .then(res => res.status === 200 ? setComment({ ...res.body }) : console.log(res.body))
        .catch(err => console.log(err));
    };


    const handleReply = reply => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text: reply })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReplies([res.body, ...replies]) : console.log(res.body))
        .catch(err => console.log(err));
    };


    const handleEdit = text => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${comment._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComment({ ...res.body }) : console.log(res.body))
        .catch(err => console.log(err));
    };


    const handleDelete = () => {
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
        .catch(err => console.log(err))
    };

    if (!comment) return <></>;
    return (<div id="comment">
        <h3 id="header">
            <Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link>
            {"  "}
            <span className="faded">{ new Date(comment.posted).toLocaleString() }</span>
        </h3>

        <div id="controls">
            <Like likes={ comment.likes } handleLike={ handleLike } />
            <TextPost handlePost={ handleReply } display="reply" />
            { comment.author === user ? (<>
                <Editable value={ comment.text } handleSubmit={ handleEdit } />
                <Delete handleDelete={ handleDelete } />
            </>) : <></> }<br/>
        </div><br/>

        <div id="text">{ comment.text }</div><br/>
        
        { replies === null ? (
            <button onClick={getReplies}>show replies</button>
        ) : (<>
            { replies.map(v => <Reply key={v._id} replyProp={v} />) }
        </>) }
    </div>);
}

export default Comment;


