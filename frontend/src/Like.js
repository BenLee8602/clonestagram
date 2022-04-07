import React, { Fragment as Frag, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function Like({ likes, handleLike, showCount, showNames }) {
    const [user, setUser] = useContext(UserContext);

    return (<>
        <button onClick={handleLike}>{ likes.includes(user) ? "unlike" : "like" }</button>
        
        { showCount ? likes.length : <></> }

        { showNames && likes.length ? <>
            { "liked by: " }
            { likes.length > 1 ? <>
                { likes.slice(Math.max(0, likes.length - 3), Math.max(0, likes.length - 1))
                .map((v, i) => <Frag key={i}><Link to={`/users/${v}/profile`}>{v}</Link>, </Frag>) }
                { " and " }
            </> : <></> }
            <Link to={`/users/${likes[likes.length - 1]}/profile`}>{likes[likes.length - 1]}</Link>
        </> : <></> }
    </>);
}

export default Like;
