
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Si no inició sesión, enviarlo al login
    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    // Comprobar que el usuario tenga el rol permitido
    if (!allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
            return <Navigate to="/admin/appointments" replace />;
        }

        if (user.role === "patient") {
            return <Navigate to="/my-appointments" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
