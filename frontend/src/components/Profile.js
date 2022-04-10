import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Post from "./Post";
import UserList from "./UserList";
import "../style/Profile.css";

function Profile() {
    const name = useParams().name;
    const [profile, setProfile] = useState({ success: false });
    const [content, setContent] = useState("posts");
    const [postSize, setPostSize] = useState(true);

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
        fetch(`http://localhost:3000/users/${name}/follow`, req)
        .then(res => res.json())
        .then(res => setProfile({
            ...profile,
            user: res.user,
            isFollowing: !profile.isFollowing
        }))
        .catch(err => console.log(err));
    };

    if (!profile.success) return (<h1 className="tile">profile not found</h1>);
    return (<>
        <div id="profileBody" className="tile padded">
            <div id="profilenav">
                <img id="pfp" src={ profile.user.pfp } alt="pfp not found" />
                <button className={ content === "posts" ? "active" : "" } onClick={ () => setContent("posts") }>
                    <h3>posts</h3>
                    <h2>{ profile.posts.length }</h2>
                </button>
                <button className={ content === "followers" ? "active" : "" } onClick={ () => setContent("followers") }>
                    <h3>followers</h3>
                    <h2>{ profile.user.followers.length }</h2>
                </button>
                <button className={ content === "following" ? "active" : "" } onClick={ () => setContent("following") }>
                    <h3>following</h3>
                    <h2>{ profile.user.following.length }</h2>
                </button>
            </div>

            { profile.isThisUser ? (
                <Link id="editprofile" className="item" to="/edit/profile">edit profile</Link>
            ) : (
                <button id="follow" onClick={ handleFollow }>{ profile.isFollowing ? "unfollow" : "follow" }</button>
            ) }

            <h1>{ profile.user.name }</h1>
            <h3>{ profile.user.nick }</h3>
            <p id="bio">{ profile.user.bio }</p>
        </div>
        
        { content === "posts" ? <>
            <div className="tile">
                <button className={ "postview" + (postSize ? " active" : "") } onClick={ () => setPostSize(true)  }>view small</button>
                <button className={ "postview" + (postSize ? "" : " active") } onClick={ () => setPostSize(false) }>view large</button>
            </div>
            { profile.posts.map(v => <Post key={v._id} data={v} view={ postSize ? "mini" : "" } />) }
        </> : <></> }
        { content === "followers" ? <UserList names={profile.user.followers} /> : <></> }
        { content === "following" ? <UserList names={profile.user.following} /> : <></> }
    </>);
}

export default Profile;
