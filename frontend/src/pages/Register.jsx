import { useState } from "react";
import "../styles/Register.css";
import { Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
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

        setMessage("Registrando usuario...");

        try {
            const response = await fetch(
                `${API_URL}/api/register`,
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
                    data.message || "No se pudo registrar el usuario."
                );
                return;
            }

            setMessage("Usuario registrado correctamente.");

            setForm({
                name: "",
                email: "",
                password: ""
            });

        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        }
    };

return (
    <div className="register-section">
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>¡Bienvenido!</h1>
                <p>Regístrate para crear tu cuenta</p>
                
                <div className="campo">
                    <label className="label-titulo">
                        Nombre
                    </label>

                    <input
                        className="input-text"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        minLength="8"
                    />
                </div>

                <button className="boton" type="submit">
                    Registrarme
                </button>

                <p className="register-message">{message}</p>

                <div className="register-footer">
                    <a href="/login">
                        ¿Ya tienes una cuenta? Inicia sesión
                    </a>
                </div>
            </form>
        </div>
    </div>
);
}

export default Register;