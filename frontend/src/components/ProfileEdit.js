import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";
import UserContext from "../UserContext";
import "../style/ProfileEdit.css";

function ProfileEdit() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState({ success: false });

    const [pfp, setPfp] = useState("");
    const [nick, setNick] = useState("");
    const [bio, setBio] = useState("");


    useEffect(() => {
        const req = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json())
        .then(res => {
            setProfile(res);
            setPfp(res.user.pfp);
            setNick(res.user.nick);
            setBio(res.user.bio);
        })
        .catch(err => console.log(err));
    }, []);


    const handleSubmit = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                pfp: pfp,
                nick: nick,
                bio: bio
            })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json())
        .then(res => {
            if (res.success)
                return Navigate(`/users/${profile.user.name}/profile`);
            console.log("error in editing profile");
        })
        .catch(err => console.log(err));
    };


    const handleDelete = async () => {
        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, req)
        .then(res => res.json())
        .then(res => {
            if (!res.success)
                return console.log("error in deleting account");
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            Navigate("/login");
        })
        .catch(err => console.log(err));
    };


    if (!profile.success) return (<div className="content"><h1>loading</h1></div>);
    return (<div id="editProfile" className="tile padded">
        <input
            type="text"
            placeholder="profile icon url"
            defaultValue={ profile.user.pfp }
            onChange={ e => setPfp(e.target.value) }
        /><br/>
        <input
            type="text"
            placeholder="nickname"
            defaultValue={ profile.user.nick }
            onChange={ e => setNick(e.target.value) }
        /><br/>
        <textarea
            placeholder="bio"
            defaultValue={ profile.user.bio }
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
