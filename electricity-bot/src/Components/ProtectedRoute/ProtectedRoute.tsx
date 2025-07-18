import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../../context/UserContext.tsx";

export const ProtectedRoute = () => {
    const { user } = useUserContext();

    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};