import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Reply from "./Reply";
import Delete from "./Delete";
import Editable from "./Editable";
import Like from "./Like";
import TextPost from "./TextPost";

function Comment({ comment, setPost, showReplies }) {
    const [user, setUser] = useContext(UserContext);
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


    const handleReply = newReply => {
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


    return (<div className="comment">
        <h3 style={{"display":"inline"}}>
            <Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link>
            {" | "}
            { new Date(comment.posted).toLocaleString() }
        </h3>

        <div style={{"display":"inline","float":"right"}}>
            <Like likes={ comment.likes } handleLike={ handleLike } showCount />
            <TextPost handlePost={ handleReply } display="reply" />
            { comment.author === user ? (<>
                <Editable value={ comment.text } handleSubmit={ handleEdit } />
                <Delete handleDelete={ handleDelete } />
            </>) : <></> }<br/>
        </div><br/>

        <div style={{"whiteSpace":"pre-wrap","display":"inline"}}>{ comment.text }</div><br/>
        
        { showReplies && comment.replies.length ? <>
            <button onClick={ () => setReplyCount(Math.max(0, replyCount - 3)) }>show less</button>
            <button onClick={ () => setReplyCount(Math.min(replyCount + 3, comment.replies.length)) }>show more</button>
            {
                comment.replies.slice(Math.max(0, comment.replies.length - replyCount), Math.max(0, comment.replies.length))
                .map(v => <Reply key={v._id} reply={v} setPost={setPost} />)
            }
        </> : <></> }
    </div>);
}

export default Comment;


