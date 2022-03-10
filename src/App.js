import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import UserContext from "./UserContext";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";


function App() {
    const [user, setUser] = useState(null);

    return (<>
        <BrowserRouter>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
            <UserContext.Provider value={ [user, setUser] }>
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/register" element={ <Register/> } />
                    <Route path="/login" element={ <Login/> } />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    </>);
}

export default App;
