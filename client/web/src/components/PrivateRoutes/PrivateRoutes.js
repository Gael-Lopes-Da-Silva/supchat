import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored?.token;

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            localStorage.removeItem("user");
            return <Navigate to="/login" state={{ expired: true }} />;
        }

        return <Outlet />; // transforme privatzRoutes en composant parent pour les routes qui sont wrappées par privateRoutes
    } catch {
        localStorage.removeItem("user");
        return <Navigate to="/login" />;
    }
};

export default PrivateRoutes;
