import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";

import "../style/Reply.css";


function Reply({ data }) {
    const [user, setUser] = useContext(UserContext);
    const [reply, setReply] = useState(null);
    const [view, setView] = useState(null);
    const [input, setInput] = useState("");
    
    useEffect(() => setReply({ ...data }), [data]);


    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };
        
        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${reply._id}/like`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReply({ ...reply, likes: res.body }) : console.log(res.body))
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${reply._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReply({ ...res.body }) : console.log(res.body))
        .catch(err => console.log(err));

        setView(null);
    };


    const handleDelete = () => {
        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${reply._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setReply(null) : console.log(res.body))
        .catch(err => console.log(err));
    };

    
    if (!reply) return <></>;

    if (view === "edit") return (<div className="reply-modify">
        <input type="text" placeholder="new reply text" onChange={ e => setInput(e.target.value) } />
        <button onClick={ () => setView(null) }>✕</button>
        <button onClick={handleEdit}>✓</button>
    </div>);

    if (view === "delete") return (<div className="reply-modify">
        <input type="text" placeholder="enter username to confirm" onChange={ e => setInput(e.target.value) } />
        <button onClick={ () => setView(null) }>✕</button>
        <button onClick={handleDelete}>✓</button>
    </div>);

    return (<div className="reply">
        <div className="reply-body">
            <Link to={`/users/${reply.author}/profile`} className="reply-author">{ reply.author }</Link>
            <span className="reply-date">{ new Date(reply.posted).toLocaleString() }</span><br/>
            <span className="reply-text">{ reply.text }</span>
        </div>
        <div className="reply-actions">
            { reply.likes.length }
            <button onClick={handleLike}>{ " ♥" }</button>
            { reply.author === user ? <>
                <button onClick={ () => setView("edit") }>✎</button>
                <button onClick={ () => setView("delete") }>🗑</button>
            </> : <></> }
        </div>
    </div>);
}


export default Reply;
