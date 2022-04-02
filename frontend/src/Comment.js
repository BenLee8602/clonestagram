import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Reply from "./Reply";

function Comment({ comment }) {
    const [user, setUser] = useContext(UserContext);

    const [nLikes, setNLikes] = useState(comment.likes.length);
    const [liked, setLiked] = useState(comment.likes.includes(user));

    const [replies, setReplies] = useState(comment.replies);
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
        
        fetch(`http://localhost:3000/posts/comments/${comment._id}/like`, req)
        .then(res => res.json())
        .then(res => {
            setNLikes(res.liked ? nLikes + 1 : nLikes - 1);
            setLiked(user && !liked);
        })
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

        fetch(`http://localhost:3000/posts/comments/${comment._id}/reply`, req)
        .then(res => res.json())
        .then(res => {
            if (res.success)
                setReplies([...replies, res.reply]);
        })
        .catch(err => console.log(err));
    };


    const handleReplyLike = (id) => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };
        
        fetch(`http://localhost:3000/posts/comments/reply/${id}/like`, req)
        .then(res => res.json())
        .then(res => {
            if (!res.success) return console.log(res);
            let newReplies = [...replies];
            newReplies[res.idx].likes = res.likes;
            setReplies([...newReplies]);
        })
        .catch(err => console.log(err));
    };


    return (<div className="item">
        <h3><Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link> | { new Date(comment.posted).toLocaleString() }</h3>
        <div style={{"whiteSpace":"pre-wrap"}}>{ comment.text }</div>

        <button onClick={handleLike}>{ liked ? "unlike" : "like" }</button> likes: { nLikes }<br/>

        <input type="text" placeholder="reply" onChange={ e => setNewReply(e.target.value) } />
        <button onClick={ handleReply }>send</button>

        <button onClick={ () => setReplyCount(Math.max(0, replyCount - 3)) }>show less</button>
        <button onClick={ () => setReplyCount(Math.min(replyCount + 3, replies.length)) }>show more</button>
        {
            replies.slice(Math.max(0, replies.length - replyCount), Math.max(0, replies.length))
            .map(v => <Reply key={v._id} reply={v} handleLike={handleReplyLike} />)
        }
    </div>);
}

export default Comment;
