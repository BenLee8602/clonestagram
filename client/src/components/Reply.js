import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Delete from "./Delete";
import Editable from "./Editable";
import Like from "./Like";
import UserContext from "../UserContext";
import "../style/Reply.css";

function Reply({ reply, updateComments }) {
    const [user, setUser] = useContext(UserContext);


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
        .then(res => res.status === 200 ? updateComments(res.body) : console.log(res.body))
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${reply._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? updateComments(res.body) : console.log(res.body))
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

        fetch(`${process.env.REACT_APP_BACKEND_API}/replies/${reply._id}`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? updateComments(res.body) : console.log(res.body))
        .catch(err => console.log(err));
    };


    return (<div id="reply">
        <strong id="header">
            <Link to={`/users/${reply.author}/profile`}>{ reply.author }</Link>
            {"  "}
            <span className="faded">{ new Date(reply.posted).toLocaleString() }</span>
        </strong>

        <div id="controls">
            <Like likes={ reply.likes } handleLike={ handleLike } />
            { reply.author === user ? (<>
                <Editable value={ reply.text } handleSubmit={ handleEdit } />
                <Delete handleDelete={ handleDelete } />
            </>) : <></> }
        </div><br/>

        <p id="text">{ reply.text }</p>
    </div>);
}

export default Reply;
