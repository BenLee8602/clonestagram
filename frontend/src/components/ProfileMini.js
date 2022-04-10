import React from "react";
import { Link } from "react-router-dom";
import "../style/ProfileMini.css";

function ProfileMini({ user }) {
    return (<div id="profileMini" className="tile">
        <img id="pfp" src={ user.pfp } alt="pfp not found" />
        <div id="content">
            <h3><Link to={`/users/${user.name}/profile`}>{ user.name }</Link></h3>
            <p>{ user.nick }</p>
        </div>
    </div>);
}

export default ProfileMini;
