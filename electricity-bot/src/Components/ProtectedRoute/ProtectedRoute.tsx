import {Navigate, Outlet} from "react-router-dom";
import {SESSION_KEY} from "../../constants/session.ts";

export const ProtectedRoute = () => {
    const token = localStorage.getItem(SESSION_KEY);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};