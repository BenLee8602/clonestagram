import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import BigList from "./BigList";

import "../style/content.css";
import "../style/Profile.css";


function Profile() {
    const name = useParams().name;
    const [user, setUser] = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [view, setView] = useState("posts");


    const req = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    };

    useEffect(async () => {
        if (user === undefined) return;
        setView("posts");
        const url = `${process.env.REACT_APP_BACKEND_API}/users/${name}/profile`;
        try {
            const res = await fetch(url + (user ? `?cur=${user}` : ``));
            const body = await res.json();
            if (res.status !== 200) return console.log(body);
            setProfile(body);
        } catch (err) { console.log(err); }
    }, [name, user]);


    const handleFollow = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API}/follows/${name}`, req);
            const body = await res.json();
            if (res.status === 200)  return setProfile({ // unfollowed
                ...profile,
                followerCount: profile.followerCount - 1,
                following: false
            });
            if (res.status === 201) return setProfile({ // followed
                ...profile,
                followerCount: profile.followerCount + 1,
                following: true
            });
            console.log(body);
        } catch (err) { console.log(err); }
    };


    if (!profile) return (<h1 className="profile">profile not found</h1>);

    return (<>
        <div className="profile">
            <div className="profile-col1">
                <img src={ profile.pfp ? profile.pfp : "/icons/user.png" } alt="pfp" className="profile-img"/>
                { profile.name === user ? (
                    <Link to="/edit/profile" className="profile-under-pfp">edit profile</Link>
                ) : (<button id="follow" onClick={ handleFollow } className="profile-under-pfp">
                    { profile.following ? "unfollow" : "follow" }
                </button>) }
            </div>
            <div className="profile-col2">
                <button onClick={ () => setView("posts") } className="profile-switch">
                    <p className="profile-switch-title">posts</p>
                    <p className="profile-switch-subtitle">{ profile.postCount }</p>
                </button>
                <button onClick={ () => setView("followers") } className="profile-switch">
                    <p className="profile-switch-title">followers</p>
                    <p className="profile-switch-subtitle">{ profile.followerCount }</p>
                </button>
                <button onClick={ () => setView("following") } className="profile-switch">
                    <p className="profile-switch-title">following</p>
                    <p className="profile-switch-subtitle">{ profile.followingCount }</p>
                </button>
                <h1 className="profile-nick">{ profile.nick ? profile.nick : profile.name }</h1>
                <h3 className="profile-name">{ profile.nick && profile.name !== profile.nick ? profile.name : "" }</h3>
                <p className="profile-bio">{ profile.bio }</p>
            </div>
        </div>

        { view === "posts" ? <div className="postlist"><BigList
            key={name + view}
            route={`posts/author/${name}`}
            map={ v => <Link key={v._id} to={`/posts/${v._id}`} className="postlist-item">
                <img src={v.image} alt="post" className="postlist-image" />
            </Link> }
        /></div> : <div className="userlist"><BigList
            key={name + view}
            route={`follows/${name}/${view}`}
            map={ v => <Link key={v._id} to={`/users/${v.name}/profile`} className="userlist-item">
                <img src={ v.pfp ? v.pfp : "/icons/user.png" } alt="pfp" className="userlist-item-img" />
                <div className="userlist-item-text">
                    <span className="userlist-item-nick">{ v.nick ? v.nick : v.name }</span>{' '}
                    <span className="userlist-item-name">{ v.nick && v.name !== v.nick ? v.name : "" }</span>
                </div>
            </Link> }
        /></div> }
    </>);
}


export default Profile;
