import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

function Login() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [curName, setCurName] = useState("");
    const [curPass, setCurPass] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleLogin = () => {
        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: curName, pass: curPass })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/login`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status !== 200) return setErrMsg(res.body);
            localStorage.setItem("token", res.body);
            setUser(curName);
            Navigate("/");
        });
    };

    return (<div className="tile padded">
        <h1>login</h1>
        <input type="text" placeholder="username" onChange={ e => setCurName(e.target.value) } /><br/>
        <input type="password" placeholder="password" onChange={ e => setCurPass(e.target.value) } /><br/>
        <p>{ errMsg }</p>
        <button className="active" onClick={ handleLogin }>Submit</button>
    </div>);
}

export default Login;
