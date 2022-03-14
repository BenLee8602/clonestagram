import React, { useContext } from "react";
import UserContext from "./UserContext";

function Profile() {
    const [user, setUser] = useContext(UserContext);

    return (<>
        <h1>{ user }</h1>
        Profile info for { user } goes here
    </>);
}

export default Profile;
