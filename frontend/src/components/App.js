import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserContext from "../UserContext";

import ProtectedRoute from "../ProtectedRoute";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";
import Login from "./Login";
import Register from "./Register";
import NewPost from "./NewPost";
import Search from "./Search";
import Post from "./Post";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const req = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };

        fetch("http://localhost:3000/users", req)
        .then(res => res.json())
        .then(res => setUser(res.name))
        .catch(err => console.log(err));
    }, []);

    return (<>
        <BrowserRouter>
            <UserContext.Provider value={ [user, setUser] }>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/users/:name/profile" element={ <Profile/> } />
                    <Route path="/search" element={ <Search/> } />
                    <Route path="/posts/:id" element={ <Post/> } />
                    <Route path="/posts/:id/likes" element={ <Post view="likes" /> } />
                    <Route path="/posts/:id/comments" element={ <Post view="comments" /> } />
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
