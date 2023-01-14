import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "../style/NewPost.css";

function NewPost() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                image: image,
                caption: caption
            })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/posts`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? Navigate(`/users/${user}/profile`) : console.log(res.body))
        .catch(err => console.log(err));
    };

    return (<div id="newPost" className="tile padded">
        <h1>new post</h1>
        <input type="text" placeholder="image url" onChange={ e => setImage(e.target.value) } /><br/>
        <input type="text" placeholder="caption" onChange={ e => setCaption(e.target.value) } /><br/>
        <p>{ errMsg }</p><br/>
        <button className="active" onClick={ handleSubmit }>Submit</button>
    </div>);
}

export default NewPost;
