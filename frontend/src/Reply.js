import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Delete from "./Delete";
import Editable from "./Editable";
import UserContext from "./UserContext";

function Reply({ reply, setPost }) {
    const [user, setUser] = useContext(UserContext);


    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };
        
        fetch(`http://localhost:3000/replies/${reply._id}/like`, req)
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

        fetch(`http://localhost:3000/replies/${reply._id}`, req)
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

        fetch(`http://localhost:3000/replies/${reply._id}`, req)
        .then(res => res.json())
        .then(res => setPost({ ...res.newPost }))
        .catch(err => console.log(err));
    };


    return (<div className="item">
        <strong>
            <Link to={`/users/${reply.author}/profile`}>{ reply.author }</Link>
            {" | "}
            { new Date(reply.posted).toLocaleString() }
        </strong>
        { reply.author === user ? (<>
            <Delete handleDelete={ handleDelete } />
            <Editable value={ reply.text } handleSubmit={ handleEdit } />
        </>) : <></> }
        <button onClick={() => handleLike(reply._id)}>{ reply.likes.includes(user) ? "unlike" : "like" }</button>{ reply.likes.length }<br/>
        <p style={{"margin":"0px","fontSize":"14px"}}>{ reply.text }</p>
    </div>);
}

export default Reply;
