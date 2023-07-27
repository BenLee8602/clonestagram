import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CurrentUser, RequireLogin } from "./Auth";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";
import Login from "./Login";
import Register from "./Register";
import NewPost from "./NewPost";
import Search from "./Search";
import OnePost from "./OnePost";

function App() {
    return (<>
        <BrowserRouter>
            <CurrentUser>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={ <Home/> } />
                    <Route path="/users/:name/profile" element={ <Profile/> } />
                    <Route path="/search" element={ <Search/> } />
                    <Route path="/posts/:id" element={ <OnePost/> } />
                    <Route element={ <RequireLogin/> }>
                        <Route path="/newpost" element={ <NewPost/> } />
                        <Route path="/edit/profile" element={ <ProfileEdit/> } />
                    </Route>
                    <Route path="/register" element={ <Register/> } />
                    <Route path="/login" element={ <Login/> } />
                </Routes>
            </CurrentUser>
        </BrowserRouter>
    </>);
}

export default App;
