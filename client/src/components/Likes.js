import React from "react";
import { Link, useParams } from "react-router-dom";
import BigList from "./BigList";

import "../style/userlist.css";


function Likes() {
    const id = useParams().id;

    return <div className="userlist"><BigList
        key={id}
        route={`likes/${id}`}
        map={ v => <Link key={v._id} to={`/users/${v.name}`} className="userlist-item">
            <img src={ v.pfp ? v.pfp : "/icons/user.png" } alt="pfp" className="userlist-item-img" />
            <div className="userlist-item-text">
                <span className="userlist-item-nick">{ v.nick ? v.nick : v.name }</span>{' '}
                <span className="userlist-item-name">{ v.nick && v.name !== v.nick ? v.name : "" }</span>
            </div>
        </Link> }
    /></div>
}


export default Likes;
