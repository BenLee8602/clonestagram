import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Post from "./Post";
import UserList from "./UserList";

function Profile() {
    const name = useParams().name;
    const [profile, setProfile] = useState({ success: false });
    const [content, setContent] = useState("posts");

    const req = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    };

    useEffect(() => {
        setContent("posts");
        fetch(`http://localhost:3000/users/${name}/profile`, req)
        .then(res => res.json())
        .then(res => setProfile(res))
        .catch(err => console.log(err));
    }, [name]);

    const handleFollow = () => {
        fetch(`http://localhost:3000/users/${name}/profile/follow`, req)
        .then(res => res.json())
        .then(res => setProfile({
            ...profile,
            user: res.user,
            isFollowing: !profile.isFollowing
        }))
        .catch(err => console.log(err));
    };

    if (!profile.success) return (<div className="content"><h1>profile not found</h1></div>);
    return (<div className="content">
        <div id="profilenav">
            <img src={ profile.user.pfp } alt="pfp not found" style={{"width":"20vw", "height":"20vw"}} />
            <button onClick={ () => setContent("posts") }>
                <h3>posts</h3>
                <h2>{ profile.posts.length }</h2>
            </button>
            <button onClick={ () => setContent("followers") }>
                <h3>followers</h3>
                <h2>{ profile.user.followers.length }</h2>
            </button>
            <button onClick={ () => setContent("following") }>
                <h3>following</h3>
                <h2>{ profile.user.following.length }</h2>
            </button>
        </div>

        { profile.isThisUser ? (
            <Link id="editprofile" className="item" to="/edit/profile">edit profile</Link>
        ) : (
            <button onClick={ handleFollow } style={{"marginTop":"4px","width":"20vw"}}>{ profile.isFollowing ? "unfollow" : "follow" }</button>
        ) }

        <h1>{ profile.user.name }</h1>
        <h3>{ profile.user.nick }</h3>
        <p style={{"whiteSpace":"pre-wrap"}}>{ profile.user.bio }</p>
        { content === "posts" ? (profile.posts.map((v, i) => <Post key={ i } post={ v } />)) : <></> }
        { content === "followers" ? (<><h1>followers</h1><UserList names={profile.user.followers} /></>) : <></> }
        { content === "following" ? (<><h1>following</h1><UserList names={profile.user.following} /></>) : <></> }
    </div>);
}

export default Profile;
