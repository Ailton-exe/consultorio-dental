import { useState } from "react";
import "../styles/AdminRegisterPatient.css";

function AdminRegisterPatient() {
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

        setMessage("Registrando paciente...");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/admin/patients",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "No se pudo registrar el paciente."
                );
                return;
            }

            setMessage("Paciente registrado correctamente.");

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
        <div className="admin-reg-section">
            <div className="admin-reg-container">
                <form className="admin-reg-form" onSubmit={handleSubmit}>
                    <h1>Registrar paciente</h1>
                    <div className="campo">
                        <label className="label-titulo" htmlFor="name">
                            Nombre completo
                        </label>

                        <input
                        className="input-text"
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="campo">
                        <label className="label-titulo" htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                        className="input-text"
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="campo">
                        <label className="label-titulo" htmlFor="password">
                            Contraseña
                        </label>

                        <input
                        className="input-text"
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength="8"
                        />
                    </div>

                    <button type="submit" className="boton">
                        Registrar paciente
                    </button>
                </form>
            <p>{message}</p>
            </div>
        </div>
    );
}

export default AdminRegisterPatient;