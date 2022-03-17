import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

function NewPost() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = () => {
        if (title === "") {
            setErrMsg("Post title is required");
            return;
        }
        else if (content === "") {
            setErrMsg("Post content is required");
            return;
        }

        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: user,
                title: title,
                content: content
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
        <input type="text" placeholder="title" onChange={ e => setTitle(e.target.value) } /><br/>
        <textarea onChange={ e => setContent(e.target.value) } /> <br/>
        <p>{ errMsg }</p><br/>
        <button onClick={ handleSubmit }>Submit</button>
    </div>);
}

export default NewPost;
