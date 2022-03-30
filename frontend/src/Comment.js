import React, { useState } from "react";
import { Link } from "react-router-dom";

function Comment({ comment }) {
    const [nLikes, setNLikes] = useState(comment.likes.length);
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
        .then(res => setNLikes(res.liked ? nLikes + 1 : nLikes - 1))
        .catch(err => console.log(err));
    };

    return (<div className="item">
        <h3><Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link> | { new Date(comment.posted).toLocaleString() }</h3>
        <div style={{"whiteSpace":"pre-wrap"}}>{ comment.text }</div>
        <button onClick={handleLike}>like</button> likes: { nLikes }
    </div>);
}

export default Comment;
