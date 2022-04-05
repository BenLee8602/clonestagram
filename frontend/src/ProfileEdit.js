import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileEdit() {
    const Navigate = useNavigate();
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

        fetch("http://localhost:3000/users/profile", req)
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

        fetch(`http://localhost:3000/users/profile/edit`, req)
        .then(res => res.json())
        .then(res => {
            res.success ? (
                Navigate(`/users/${profile.user.name}/profile`)
            ) : (
                console.log("error in editing profile")
            )
        })
        .catch(err => console.log(err));

        
    };

    if (!profile.success) return (<div className="content"><h1>loading</h1></div>);
    return (<div className="content">
        <input
            placeholder="profile icon url"
            defaultValue={ profile.user.pfp }
            onChange={ e => setPfp(e.target.value) }
        /><br/>
        <input
            placeholder="nickname"
            defaultValue={ profile.user.nick }
            onChange={ e => setNick(e.target.value) }
        /><br/>
        <textarea
            placeholder="bio"
            defaultValue={ profile.user.bio }
            onChange={ e => setBio(e.target.value) }
        /><br/>
        <button onClick={ handleSubmit }>submit</button>
    </div>);
}

export default ProfileEdit;
