import React, { useEffect, useState } from "react";
import ProfileMini from "./ProfileMini";

function UserList({ names }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ names: names })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => res.status === 200 ? setUsers(res.body) : console.log(res.body))
        .catch(err => console.log(err))
    }, [names]);

    return (<>
        { users.map((v, i) => <ProfileMini key={i} user={v} />) }
    </>);
}

export default UserList;
