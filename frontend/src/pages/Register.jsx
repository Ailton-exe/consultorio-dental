import { useState } from "react";

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
                "http://127.0.0.1:8000/api/register",
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
        <div>
            <h1>Registro de paciente</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        minLength="8"
                    />
                </div>

                <button type="submit">
                    Registrarme
                </button>
            </form>

            <p>{message}</p>
        </div>
    );
}

export default Register;