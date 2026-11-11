import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { API_URL } from "../config";

function LogoutButton() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (token) {
                await fetch(`${API_URL}/api/logout`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="logout-button"
        >
            <LogOut size={22} />
        </button>
    );
}

export default LogoutButton;