import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function NavigationBar() {
    const [user, setUser] = useContext(UserContext);

    return (<>
        <nav>
            <ul>
                <li><Link to="/">home</Link></li>
                <li><Link to={ user ? `/users/${user}/profile` : "/login" }>profile</Link></li>
                <li><Link to="/search">search</Link></li>
                <li><Link to="/newpost">new</Link></li>
                { 
                    user ? (
                        <li><Link to="/login" onClick={ () => setUser(null) }>logout</Link></li>
                    ) : (<>
                        <li><Link to="/register">register</Link></li>
                        <li><Link to="/login">login</Link></li>
                    </>)
                }
            </ul>
        </nav>
    </>);
}

export default NavigationBar;
