import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";

function Home() {
    const [user, setUser] = useContext(UserContext);

    return (<>
        <h1>Home</h1>
        User is: { user }<br/>
    </>);
}

export default Home;
