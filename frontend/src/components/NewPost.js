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

        fetch("http://localhost:3000/posts", req)
        .then(res => res.json())
        .then(res => {
            if (res.success) Navigate(`/users/${user}/profile`);
            else setErrMsg(res.msg);
            console.log(res.msg);
        });
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
