import React from "react";
import { Link } from "react-router-dom";

function ProfileMini({ user }) {
    return (<div className="item">
        <h3><Link to={`/users/${user.name}/profile`}>{ user.name }</Link></h3>
        <p>User bio goes here!</p>
    </div>);
}

export default ProfileMini;
