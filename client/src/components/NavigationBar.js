import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../UserContext";
import "../style/NavigationBar.css";

function NavigationBar() {
    const [user, setUser] = useContext(UserContext);


    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };


    const curPath = useLocation().pathname;
    const isActive = path => curPath === path ? " navActive" : "";


    return (<>
        <nav>
            <ul>
                <li className={ "left" + isActive("/") }>
                    <Link to="/">home</Link>
                </li>
                <li className={ "left" + isActive(`/users/${user}/profile`) }>
                    <Link to={ user ? `/users/${user}/profile` : "/login" }>profile</Link>
                </li>
                <li className={ "left" + isActive("/search") }>
                    <Link to="/search">search</Link>
                </li>
                <li className={ "left" + isActive("/newpost") }>
                    <Link to="/newpost">new</Link>
                </li>
                { user ? (
                    <li className="right">
                        <Link to="/login" onClick={ logout }>logout</Link>
                    </li>
                ) : (<>
                    <li className={ "right" + isActive("/register") }>
                        <Link to="/register">register</Link>
                    </li>
                    <li className={ "right" + isActive("/login") }>
                        <Link to="/login">login</Link>
                    </li>
                </>) }
            </ul>
        </nav>
    </>);
}

export default NavigationBar;
