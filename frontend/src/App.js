import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserContext from "./UserContext";

import ProtectedRoute from "./ProtectedRoute";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";

function App() {
    const [user, setUser] = useState(null);

    return (<>
        <BrowserRouter>
            <UserContext.Provider value={ [user, setUser] }>
                <NavigationBar />
                <Routes>
                    <Route element={ <ProtectedRoute authorized={ !!user } /> }>
                        <Route path="/" element={ <Home/> } />
                        <Route path="/profile" element={ <Profile/> } />
                    </Route>
                    <Route path="/register" element={ <Register/> } />
                    <Route path="/login" element={ <Login/> } />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    </>);
}

export default App;
