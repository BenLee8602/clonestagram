import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ authorized, redirect = "/login" }) {
    return authorized ? <Outlet/> : <Navigate to={ redirect } />
}

export default ProtectedRoute;
