import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

import "../style/content.css";
import "../style/Login.css";


function Register() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [curName, setCurName] = useState("");
    const [curPass, setCurPass] = useState("");
    const [curPassConf, setCurPassConf] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleRegister = () => {
        if (curPass !== curPassConf) {
            setErrMsg("Passwords do not match");
            return;
        }

        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: curName, pass: curPass })
        };

        fetch(`${process.env.REACT_APP_BACKEND_API}/users/register`, req)
        .then(res => res.json().then(body => ({ status: res.status, body })))
        .then(res => {
            if (res.status !== 200) return setErrMsg(res.body);
            localStorage.setItem("refreshToken", res.body.refreshToken);
            localStorage.setItem("accessToken",  res.body.accessToken);
            setUser(curName);
            Navigate("/");
        });
    };

    return (<div id="login" className="content">
        <h1>register</h1>
        <input type="text" placeholder="username" onChange={ e => setCurName(e.target.value) } /><br/>
        <input type="password" placeholder="password" onChange={ e => setCurPass(e.target.value) } /><br/>
        <input type="password" placeholder="confirm" onChange={ e => setCurPassConf(e.target.value) } /><br/>
        <p>{ errMsg }</p>
        <button onClick={ handleRegister }>Submit</button>
    </div>);
}


export default Register;
