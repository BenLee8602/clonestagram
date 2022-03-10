import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./UserContext";

function Home() {
    const [user, setUser] = useContext(UserContext);
    if (!user) return (<Navigate to="/login" />)
    return (<>
        <h1>Home</h1>
        User is: { user }<br/>
        <button onClick={ () => setUser(null) }>Logout</button>
    </>);
}

export default Home;
