import React, { useState } from "react";

function Editable({ value, handleSubmit }) {
    const [editing, setEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);

    const handleDone = () => {
        handleSubmit(newValue);
        setEditing(false);
    }

    if (editing) return (<>
        <input
            className="active"
            type="text"
            value={ newValue }
            onChange={ e => setNewValue(e.target.value) }
        />
        <button className="active" onClick={ handleDone }>done</button>
    </>);

    return (<>
        <button onClick={ () => setEditing(true) }>edit</button>
    </>);
}

export default Editable;
