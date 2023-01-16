import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";
import UserContext from "../UserContext";
import "../style/ProfileEdit.css";

function ProfileEdit() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState(null);

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


    if (!profile) return (<div className="content"><h1>loading</h1></div>);
    return (<div id="editProfile" className="tile padded">
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
        <button className="active" onClick={ handleSubmit }>submit</button><br/><br/>

        <span className="faded">
            deleting your account removes all your posts, comments, etc.<br/>
            it cannot be undone!
        </span><br/><br/>
        <Delete handleDelete={handleDelete}/>
    </div>);
}

export default ProfileEdit;
