import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import Post, { defaultPost } from "./Post";

function Profile() {
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState({ posts: [defaultPost] });

    useEffect(() => {
        fetch(`http://localhost:3000/users/${user}/profile`)
        .then(res => res.json())
        .then(res => setProfile(res))
        .catch(err => console.log(err));
    }, []);

    return (<div className="content">
        <h1>{ user }</h1>
        { profile.posts.map((v, i) => <Post key={ i } post={ v } />) }
    </div>);
}

export default Profile;
