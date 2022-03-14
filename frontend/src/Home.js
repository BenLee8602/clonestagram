import React, { useContext } from "react";
import UserContext from "./UserContext";

function Home() {
    const [user, setUser] = useContext(UserContext);
    return (<>
        <h1>Home</h1>
        User is: { user }<br/>
        Other homepage content goes here
    </>);
}

export default Home;
