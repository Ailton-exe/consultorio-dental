import { useState } from "react";

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
        <div>
            <h1>Inicio de sesión</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    Iniciar sesión
                </button>
            </form>

            <p>{message}</p>
        </div>
    );
}

export default Login;