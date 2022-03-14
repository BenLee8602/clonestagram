import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function NavigationBar() {
    const [user, setUser] = useContext(UserContext);

    if (user) return (<>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login" onClick={ () => setUser(null) }>Logout</Link></li>
            </ul>
        </nav>
    </>);

    return (<>
        <nav>
            <ul>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    </>);
}

export default NavigationBar;
