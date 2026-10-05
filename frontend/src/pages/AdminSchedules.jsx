import { useState } from "react";
import "../styles/AdminSchedules.css";

function AdminSchedules() {
    const [schedule, setSchedule] = useState({
        day: "lunes",
        start_time: "09:00",
        end_time: "14:00"
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setSchedule({
            ...schedule,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("Guardando horario...");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/admin/schedules",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(schedule)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "No se pudo guardar el horario."
                );
                return;
            }

            setMessage("Horario guardado correctamente.");

        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        }
    };

    return (
        <section className="admin-schedules-section">
            <div className="admin-schedules-container">
                <form
                    className="admin-schedules-form"
                    onSubmit={handleSubmit}
                >
                    <h1>Configuración de horarios</h1>

                    <p>
                        Configura los horarios disponibles para el consultorio.
                    </p>

                    <div className="admin-schedules-campo">
                        <label
                            className="admin-schedules-label"
                            htmlFor="day"
                        >
                            Día
                        </label>

                        <select
                            className="admin-schedules-select"
                            id="day"
                            name="day"
                            value={schedule.day}
                            onChange={handleChange}
                        >
                            <option value="lunes">Lunes</option>
                            <option value="martes">Martes</option>
                            <option value="miércoles">Miércoles</option>
                            <option value="jueves">Jueves</option>
                            <option value="viernes">Viernes</option>
                            <option value="sábado">Sábado</option>
                        </select>
                    </div>

                    <div className="admin-schedules-campo">
                        <label
                            className="admin-schedules-label"
                            htmlFor="start_time"
                        >
                            Hora de inicio
                        </label>

                        <input
                            className="admin-schedules-input"
                            id="start_time"
                            type="time"
                            name="start_time"
                            value={schedule.start_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="admin-schedules-campo">
                        <label
                            className="admin-schedules-label"
                            htmlFor="end_time"
                        >
                            Hora de cierre
                        </label>

                        <input
                            className="admin-schedules-input"
                            id="end_time"
                            type="time"
                            name="end_time"
                            value={schedule.end_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="admin-schedules-button"
                        type="submit"
                    >
                        Guardar horario
                    </button>

                    <p className="admin-schedules-message">
                        {message}
                    </p>
                </form>
            </div>
        </section>
    );
}

export default AdminSchedules;