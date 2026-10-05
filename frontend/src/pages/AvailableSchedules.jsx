import { useState } from "react";
import "../styles/AvailableSchedules.css";

function AvailableSchedules() {
    const [date, setDate] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [message, setMessage] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!date) {
            setMessage("Selecciona una fecha.");
            return;
        }

        setMessage("Consultando horarios...");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:8000/api/schedules?date=${date}`,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "No se pudieron consultar los horarios."
                );
                return;
            }

            setSchedules(data.schedules || []);
            setMessage("");

        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        }
    };

   return (
        <section className="available-schedules-section">
            <div className="available-schedules-container">

                <form
                    className="available-schedules-form"
                    onSubmit={handleSearch}
                >
                    <h1>Horarios disponibles</h1>

                    <p>
                        Consulta los horarios disponibles para tu cita.
                    </p>

                    <div className="available-schedules-campo">
                        <label
                            className="available-schedules-label"
                            htmlFor="date"
                        >
                            Selecciona una fecha
                        </label>

                        <input
                            className="available-schedules-input"
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="available-schedules-button"
                        type="submit"
                    >
                        Consultar horarios
                    </button>

                    {message && (
                        <p className="available-schedules-message">
                            {message}
                        </p>
                    )}

                    {schedules.length > 0 && (
                        <div className="available-schedules-results">
                            <h2>Horarios disponibles</h2>

                            <ul className="available-schedules-list">
                                {schedules.map((schedule) => (
                                    <li
                                        className="available-schedules-item"
                                        key={schedule.id}
                                    >
                                        {schedule.start_time} - {schedule.end_time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>

            </div>
        </section>
    );
}

export default AvailableSchedules;