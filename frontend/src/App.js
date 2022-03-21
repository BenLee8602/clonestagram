import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserContext from "./UserContext";

import ProtectedRoute from "./ProtectedRoute";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";
import Login from "./Login";
import Register from "./Register";
import NewPost from "./NewPost";
import Search from "./Search";
import ViewPost from "./ViewPost";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(storedUser);
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem("user", user);
        else localStorage.removeItem("user");
    }, [user]);

    return (<>
        <BrowserRouter>
            <UserContext.Provider value={ [user, setUser] }>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/users/:name/profile" element={ <Profile/> } />
                    <Route path="/search" element={ <Search/> } />
                    <Route path="/posts/:id" element={ <ViewPost/> } />
                    <Route element={ <ProtectedRoute authorized={ !!user } /> }>
                        <Route path="/newpost" element={ <NewPost/> } />
                        <Route path="/edit/profile" element={ <ProfileEdit/> } />
                    </Route>
                    <Route path="/register" element={ <Register/> } />
                    <Route path="/login" element={ <Login/> } />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    </>);
}

export default App;
