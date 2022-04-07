import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Reply from "./Reply";
import Delete from "./Delete";
import Editable from "./Editable";

function Comment({ comment, setPost }) {
    const [user, setUser] = useContext(UserContext);
    
    const [newReply, setNewReply] = useState("");
    const [replyCount, setReplyCount] = useState(3);
    

    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };
        
        fetch(`http://localhost:3000/comments/${comment._id}/like`, req)
        .then(res => res.json())
        .then(res => setPost({ ...res.newPost }))
        .catch(err => console.log(err));
    };


    const handleReply = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ reply: newReply })
        };

        fetch(`http://localhost:3000/comments/${comment._id}/reply`, req)
        .then(res => res.json())
        .then(res => setPost({ ...res.newPost }))
        .catch(err => console.log(err));
    };


    const handleEdit = text => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ text })
        };

        fetch(`http://localhost:3000/comments/${comment._id}`, req)
        .then(res => res.json())
        .then(res => setPost({ ...res.newPost }))
        .catch(err => console.log(err));
    };


    const handleDelete = () => {
        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };

        fetch(`http://localhost:3000/comments/${comment._id}`, req)
        .then(res => res.json())
        .then(res => setPost({ ...res.newPost }))
        .catch(err => console.log(err))
    };


    return (<div className="item">
        <h3><Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link> | { new Date(comment.posted).toLocaleString() }</h3>
        <div style={{"whiteSpace":"pre-wrap"}}>{ comment.text }</div>

        { comment.author === user ? (<>
            <Delete handleDelete={ handleDelete } />
            <Editable value={ comment.text } handleSubmit={ handleEdit } />
        </>) : <></> }

        <button onClick={handleLike}>{ comment.likes.includes(user) ? "unlike" : "like" }</button> { comment.likes.length }<br/>

        <input type="text" placeholder="reply" onChange={ e => setNewReply(e.target.value) } />
        <button onClick={ handleReply }>send</button>

        <button onClick={ () => setReplyCount(Math.max(0, replyCount - 3)) }>show less</button>
        <button onClick={ () => setReplyCount(Math.min(replyCount + 3, comment.replies.length)) }>show more</button>
        {
            comment.replies.slice(Math.max(0, comment.replies.length - replyCount), Math.max(0, comment.replies.length))
            .map(v => <Reply key={v._id} reply={v} setPost={setPost} />)
        }
    </div>);
}

export default Comment;
