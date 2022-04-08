import React, { useState } from "react";

function TextPost({ handlePost, display }) {
    const [writing, setWriting] = useState(false);
    const [text, setText] = useState("");

    const handleDone = () => {
        setWriting(false);
        handlePost(text);
    };

    if (writing) return (<>
        <input
            className="active"
            type="text"
            placeholder={ display }
            onChange={ e => setText(e.target.value) }
        />
        <button className="active" onClick={ () => setWriting(false) }>cancel</button>
        <button className="active" onClick={ handleDone }>{ display }</button>
    </>);
    return <button onClick={ () => setWriting(true) }>{ display }</button>
}

export default TextPost;
