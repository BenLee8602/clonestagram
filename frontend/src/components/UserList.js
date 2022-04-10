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

        fetch(`http://localhost:3000/users`, req)
        .then(res => res.json())
        .then(res => setUsers(res))
        .catch(err => console.log(err))
    }, [names]);

    return (<>
        { users.map((v, i) => <ProfileMini key={i} user={v} />) }
    </>);
}

export default UserList;
