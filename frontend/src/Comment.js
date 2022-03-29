import React from "react";
import { Link } from "react-router-dom";

function Comment({ comment }) {
    return (<div className="item">
        <h3><Link to={`/users/${comment.author}/profile`}>{ comment.author }</Link> | { new Date(comment.posted).toLocaleString() }</h3>
        <div style={{"whiteSpace":"pre-wrap"}}>{ comment.text }</div>
    </div>);
}

export default Comment;
