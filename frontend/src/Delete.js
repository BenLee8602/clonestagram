import React, { useContext, useState } from "react";
import UserContext from "./UserContext";

function Delete({ handleDelete }) {
    const [user, setUser] = useContext(UserContext);
    const [delConf, setDelConf] = useState(false);
    const [name, setName] = useState("");

    const handleConfirm = () => { if (name == user) handleDelete() };

    if (delConf) return (<>
        <input
            className="active"
            type="text"
            placeholder="enter username to confirm"
            onChange={ e => setName(e.target.value) }
        />
        <button className="active" onClick={ () => setDelConf(false) }>cancel</button>
        <button className="active" onClick={ handleConfirm }>delete</button>
    </>);
    return <button onClick={ () => setDelConf(true) }>delete</button>;
}

export default Delete;
