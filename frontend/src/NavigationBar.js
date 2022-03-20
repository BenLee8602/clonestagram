import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function NavigationBar() {
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (<>
        <nav>
            <ul>
                <li><Link to="/">home</Link></li>
                <li><Link to={ user ? `/users/${user}/profile` : "/login" }>profile</Link></li>
                <li><Link to="/search">search</Link></li>
                <li><Link to="/newpost">new</Link></li>
                {
                    user ? (
                        <li style={{"float":"right"}}><Link to="/login" onClick={ logout }>logout</Link></li>
                    ) : (<>
                        <li style={{"float":"right"}}><Link to="/register">register</Link></li>
                        <li style={{"float":"right"}}><Link to="/login">login</Link></li>
                    </>)
                }
            </ul>
        </nav>
    </>);
}

export default NavigationBar;
