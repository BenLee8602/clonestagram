import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

function Register() {
    const Navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [curName, setCurName] = useState("");
    const [curPass, setCurPass] = useState("");
    const [curPassConf, setCurPassConf] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleLogin = () => {
        if (curPass !== curPassConf) {
            setErrMsg("Passwords do not match");
            return;
        }

        const req = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: curName, pass: curPass })
        };

        fetch("http://localhost:3000/users/register", req)
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                localStorage.setItem("token", res.token);
                setUser(curName);
                Navigate("/");
            }
            else setErrMsg(res.msg);
            console.log(res.msg);
        });
    };

    return (<div className="tile padded">
        <h1>register</h1>
        <input type="text" placeholder="username" onChange={ e => setCurName(e.target.value) } /><br/>
        <input type="password" placeholder="password" onChange={ e => setCurPass(e.target.value) } /><br/>
        <input type="password" placeholder="confirm" onChange={ e => setCurPassConf(e.target.value) } /><br/>
        <p>{ errMsg }</p>
        <button className="active" onClick={ handleLogin }>Submit</button>
    </div>);
}

export default Register;
