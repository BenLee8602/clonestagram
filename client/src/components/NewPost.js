import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "../style/NewPost.css";

function NewPost() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [image, setImage] = useState();
    const [caption, setCaption] = useState("");

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("caption", caption);

        const req = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: formData
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/posts`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? Navigate(`/users/${user}/profile`) : console.log(res.body))
        .catch(err => console.log(err));
    };

    return (<div id="newPost" className="tile padded">
        <h1>new post</h1>
        <input type="file" name="image" onChange={ e => setImage(e.target.files ? e.target.files[0] : null) } /><br/>
        <input type="text" placeholder="caption" onChange={ e => setCaption(e.target.value) } /><br/>
        <button className="active" onClick={ handleSubmit }>Submit</button>
    </div>);
}

export default NewPost;
