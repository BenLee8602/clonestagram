import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Comment from "./Comment";

function CommentSection() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const post = useParams().id;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${post}`)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComments([...res.body]) : console.log(res.body))
        .catch(err => console.log(err));
    }, [post]);

    const handleComment = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify({ text: newComment })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/comments/${post}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setComments([res.body, ...comments]) : console.log(res.body))
        .catch(err => console.log(err));
    };

    return (<div className="tile">
        <input type="text" placeholder="new comment" onChange={ e => setNewComment(e.target.value) } />
        <button onClick={handleComment}>send</button>
        { comments.map(v => <Comment key={v._id} commentProp={v} />) }
    </div>);
}

export default CommentSection;
