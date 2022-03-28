import React from "react";
import { Link } from "react-router-dom";

function ProfileMini({ user }) {
    return (<div className="item">
        <img src={ user.pfp } alt="pfp not found" style={{"width":"64px", "height":"64px"}} />
        <h3><Link to={`/users/${user.name}/profile`}>{ user.name }</Link></h3>
        <p>{ user.nick }</p>
    </div>);
}

export default ProfileMini;
