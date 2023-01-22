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
import CommentSection from "./CommentSection";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const refresh = () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return;

            const req = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            };

            fetch(`${process.env.REACT_APP_BACKEND_API}/users/refresh`, req)
            .then(res => res.json().then(body => ({ status: res.status, body })))
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem("accessToken", res.body.accessToken);
                    setUser(res.body.user);
                } else {
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("accessToken");
                    setUser(null);
                    console.log(res.body);
                }
            })
            .catch(err => console.log(err));
        };

        refresh();
        const interval = setInterval(refresh, 870000); // 14:30
        return () => clearInterval(interval);
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
                    <Route path="/posts/:id/comments" element={ <CommentSection/> } />
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
