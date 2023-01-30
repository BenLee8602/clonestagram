import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

import "../style/content.css";
import "../style/Login.css";


function ProfileEdit() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [input, setInput] = useState("");

    const [pfp, setPfp] = useState("");
    const [nick, setNick] = useState("");
    const [bio, setBio] = useState("");


    useEffect(() => {
        const req = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status !== 200) return console.log(res.body);
            setProfile(res.body);
            setPfp(res.body.pfp);
            setNick(res.body.nick);
            setBio(res.body.bio);
        })
        .catch(err => console.log(err));
    }, []);


    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("image", pfp);
        formData.append("nick", nick);
        formData.append("bio", bio);

        const req = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: formData
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? Navigate(`/users/${profile.name}/profile`) : console.log(res.body))
        .catch(err => console.log(err));
    };


    const handleDelete = async () => {
        if (input !== user) return;

        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status !== 200) return console.log(res.body);
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            Navigate("/login");
        })
        .catch(err => console.log(err));
    };


    if (!profile) return (<div><h1>loading</h1></div>);
    return (<div className="content" id="login">
        <input
            type="file"
            name="image"
            onChange={ e => setPfp(e.target.files ? e.target.files[0] : null) }
        /><br/>
        <input
            type="text"
            placeholder="nickname"
            defaultValue={ profile.nick }
            onChange={ e => setNick(e.target.value) }
        /><br/>
        <textarea
            placeholder="bio"
            defaultValue={ profile.bio }
            onChange={ e => setBio(e.target.value) }
        /><br/>
        <button onClick={ handleSubmit }>submit</button><br/><br/>

        { deleting ? <>
            <span>deleting your account removes all your posts, comments, etc. it cannot be undone!</span>
            <input type="text" placeholder="enter username to confirm" onChange={ e => setInput(e.target.value) } />
            <button onClick={ () => setDeleting(false) }>cancel</button>
            <button onClick={handleDelete}>confirm</button>
        </> : <button onClick={ () => setDeleting(true) }>delete account</button> }
    </div>);
}

export default ProfileEdit;
