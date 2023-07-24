import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import BigList from "./BigList";
import UserList from "./UserList";

import "../style/content.css";
import "../style/Profile.css";


function Profile() {
    const name = useParams().name;
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [content, setContent] = useState("posts");


    const req = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    useEffect(() => {
        setContent("posts");
        fetch(`${process.env.REACT_APP_BACKEND_API}/users/${name}/profile`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setProfile(res.body) : console.log(res.body))
        .catch(err => console.log(err));
    }, [name]);


    const handleFollow = () => {
        fetch(`${process.env.REACT_APP_BACKEND_API}/users/${name}/follow`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status !== 200) return console.log(res.body);
            setProfile({
                ...profile,
                user: { ...profile.user, ...res.body },
                isFollowing: !profile.isFollowing
            })
        }).catch(err => console.log(err));
    };


    if (!profile) return (<h1 className="profile">profile not found</h1>);

    return (<>
        <div className="profile">
            <div className="profile-col1">
                <img src={ profile.pfp ? profile.pfp : "/icons/user.png" } alt="pfp" className="profile-img"/>
                { profile.name === user ? (
                    <Link to="/edit/profile" className="profile-under-pfp">edit profile</Link>
                ) : (<button id="follow" onClick={ handleFollow } className="profile-under-pfp">
                    { profile.followers.includes(user) ? "unfollow" : "follow" }
                </button>) }
            </div>
            <div className="profile-col2">
                <button onClick={ () => setContent("posts") } className="profile-switch">
                    <p className="profile-switch-title">posts</p>
                    <p className="profile-switch-subtitle">num</p>
                </button>
                <button onClick={ () => setContent("followers") } className="profile-switch">
                    <p className="profile-switch-title">followers</p>
                    <p className="profile-switch-subtitle">{ profile.followers.length }</p>
                </button>
                <button onClick={ () => setContent("following") } className="profile-switch">
                    <p className="profile-switch-title">following</p>
                    <p className="profile-switch-subtitle">{ profile.following.length }</p>
                </button>
                <h1 className="profile-name">{ profile.nick ? profile.nick : profile.name }</h1>
                <h3 className="profile-nick">{ profile.name }</h3>
                <p className="profile-bio">{ profile.bio }</p>
            </div>
        </div>

        { content === "posts" ? <div className="postlist"><BigList
            route={`posts/author/${name}`}
            map={ v => <Link key={v._id} to={`/posts/${v._id}`} className="postlist-item">
                <img src={v.image} alt="post" className="postlist-image" />
            </Link> }
        /></div> : <></> }
        { content === "followers" ? <UserList names={ profile.followers } /> : <></> }
        { content === "following" ? <UserList names={ profile.following } /> : <></> }
    </>);
}


export default Profile;
