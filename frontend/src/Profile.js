import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";

function Profile() {
    const name = useParams().name;
    const [profile, setProfile] = useState({ success: false });

    useEffect(() => {
        fetch(`http://localhost:3000/users/${name}/profile`)
        .then(res => res.json())
        .then(res => setProfile(res))
        .catch(err => console.log(err));
    }, [name]);

    if (!profile.success) return (<div className="content"><h1>profile not found</h1></div>);
    return (<div className="content">
        <img src={ profile.user.pfp } alt="/default_pfp.png" style={{"width":"256px", "height":"256px"}} />
        <h1>{ profile.user.name }</h1>
        <h3>{ profile.user.nick }</h3>
        <p>{ profile.user.bio }</p>
        { profile.posts.map((v, i) => <Post key={ i } post={ v } />) }
    </div>);
}

export default Profile;
