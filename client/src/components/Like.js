import React, { useContext } from "react";
import UserContext from "../UserContext";

function Like({ likes, handleLike }) {
    const [user, setUser] = useContext(UserContext);

    if (likes.includes(user))
        return <>{ likes.length } <button className="active" onClick={handleLike}>unlike</button></>;
    return <>{ likes.length } <button onClick={handleLike}>{ likes.includes(user) ? "unlike" : "like" }</button></>;
}

export default Like;
