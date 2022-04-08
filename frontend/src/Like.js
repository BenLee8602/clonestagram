import React, { Fragment as Frag, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function Like({ likes, handleLike }) {
    const [user, setUser] = useContext(UserContext);

    return (<>
        <button onClick={handleLike}>{ likes.includes(user) ? "unlike" : "like" }</button>
    </>);
}

export default Like;
