
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AvailableSchedules.css";

function AvailableSchedules() {
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const handleSearch = async (e) => {
        e.preventDefault();

        setMessage("");
        setSlots([]);

        if (date < localToday) {
            setMessage("Selecciona una fecha de hoy o posterior.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:8000/api/available-slots?date=${date}`,
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

            setSlots(data.slots || []);

            if (!data.slots?.length) {
                setMessage("No hay horarios disponibles para esta fecha.");
            }

        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
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
                            min={localToday}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="available-schedules-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Consultando..." : "Consultar horarios"}
                    </button>

                    {message && (
                        <p
                            className="available-schedules-message"
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    {slots.length > 0 && (
                        <div className="available-schedules-results">
                            <h2>Horarios disponibles</h2>

                            <ul className="available-schedules-list">
                                {slots.map((slot) => (
                                    <li
                                        className="available-schedules-item"
                                        key={slot.start_time}
                                    >
                                        {slot.start_time.slice(0, 5)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>

                <footer className="admin-book-footer">
                    <Link to="/my-appointments">
                        ← Volver a mis citas
                    </Link>
                </footer>

            </div>
        </section>
    );
}

export default AvailableSchedules;
