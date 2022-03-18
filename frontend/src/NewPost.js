import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

function NewPost() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = () => {
        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: user,
                image: image,
                caption: caption
            })
        };

        fetch("http://localhost:3000/newpost", req)
        .then(res => res.json())
        .then(res => {
            if (res.success) Navigate(`/users/${user}/profile`);
            else setErrMsg(res.msg);
            console.log(res.msg);
        });
    };

    return (<div className="content">
        <h1>new post</h1>
        <input type="text" placeholder="image url" onChange={ e => setImage(e.target.value) } /><br/>
        <input type="text" placeholder="caption" onChange={ e => setCaption(e.target.value) } /><br/>
        <p>{ errMsg }</p><br/>
        <button onClick={ handleSubmit }>Submit</button>
    </div>);
}

export default NewPost;
