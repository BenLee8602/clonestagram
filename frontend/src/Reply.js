import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function Reply({ reply, handleLike }) {
    const [user, setUser] = useContext(UserContext);

    return (<div className="item">
        <strong>
            <Link to={`/users/${reply.author}/profile`}>{ reply.author }</Link>
            {" | "}
            { new Date(reply.posted).toLocaleString() }
        </strong>
        <button onClick={() => handleLike(reply._id)}>{ reply.likes.includes(user) ? "unlike" : "like" }</button>{ reply.likes.length }<br/>
        <p style={{"margin":"0px","fontSize":"14px"}}>{ reply.text }</p>
    </div>);
}

export default Reply;
