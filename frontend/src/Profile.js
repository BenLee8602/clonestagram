import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post, { defaultPost } from "./Post";

function Profile() {
    const name = useParams().name;
    const [profile, setProfile] = useState({ success: true, posts: [defaultPost] });

    useEffect(() => {
        fetch(`http://localhost:3000/users/${name}/profile`)
        .then(res => res.json())
        .then(res => setProfile(res))
        .catch(err => console.log(err));
    }, [name]);

    return (<div className="content">
        <h1>{ name }</h1>
        { profile.success ? (
            profile.posts.map((v, i) => <Post key={ i } post={ v } />)
            ) : (
            <p className="item">User not found</p>
        ) }
    </div>);
}

export default Profile;
