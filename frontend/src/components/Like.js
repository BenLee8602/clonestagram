import React, { useContext } from "react";
import UserContext from "../UserContext";

function Like({ likes, handleLike }) {
    const [user, setUser] = useContext(UserContext);

    if (likes.includes(user))
        return <button className="active" onClick={handleLike}>unlike</button>;
    return <button onClick={handleLike}>{ likes.includes(user) ? "unlike" : "like" }</button>;
}

export default Like;
