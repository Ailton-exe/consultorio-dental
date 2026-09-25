import { useState } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("Iniciando sesión...");

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Correo o contraseña incorrectos."
                );
                return;
            }

            localStorage.setItem("token", data.token);

            setMessage("Inicio de sesión correcto.");

        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        }
    };

return (
    <div className="login-section">
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>¡Bienvenido de nuevo!</h1>
                <p>Inicia sesión en tu cuenta</p>

                <div className="campo">
                    <label className="label-titulo">
                        Correo electrónico
                    </label>

                    <input
                        className="input-text"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="campo">
                    <label className="label-titulo">
                        Contraseña
                    </label>

                    <input
                        className="input-text"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="boton" type="submit">
                    Iniciar sesión
                </button>

                <p className="login-message">{message}</p>

                <div className="login-footer">
                    <Link to="/register">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </div>
    </div>
);
}

export default Login;