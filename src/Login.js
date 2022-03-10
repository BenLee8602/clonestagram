import React, { useContext, useState } from "react";
import UserContext from "./UserContext";

function Login() {
    const [user, setUser] = useContext(UserContext);
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");

    const handleLogin = () => {
        const tempUsername = "benlee8602";
        const tempPassword = "abc123";
        if (name === tempUsername && pass === tempPassword)
            setUser(name);
    }

    return (<>
        <h1>Login</h1>
        <input type="text" placeholder="username" onChange={ e => setName(e.target.value) } /><br/>
        <input type="password" placeholder="password" onChange={ e => setPass(e.target.value) } /><br/>
        <button onClick={ handleLogin }>Submit</button>
    </>);
}

export default Login;
