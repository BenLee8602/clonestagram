import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/UserList.css";

function UserList({ names, data }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!names) return;

        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ names: names })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setUsers(res.body) : console.log(res.body))
        .catch(err => console.log(err));
    }, [names]);

    useEffect(() => {
        if (!data) return;
        setUsers([ ...data ]);
    }, [data]);

    return (<> { users.map(v => <Link key={v._id} to={`/users/${v.name}/profile`} className="userlist-item">
        <img src={ v.pfp ? v.pfp : "/icons/user.png" } alt="pfp" className="userlist-item-img" />
        <div className="userlist-item-text">
            <span className="userlist-item-nick">{ v.nick ? v.nick : v.name }</span>{' '}
            <span className="userlist-item-name">{v.name}</span>
        </div>
    </Link>) } </>);
}

export default UserList;
