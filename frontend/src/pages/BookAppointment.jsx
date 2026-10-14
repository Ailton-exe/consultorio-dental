
import { useState } from "react";
import { Link } from "react-router";
import "../styles/BookAppointment.css";

function BookAppointment() {
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    async function searchSlots(e) {
        e.preventDefault();
        setMessage("");
        setSlots([]);
        setSelectedSlot(null);

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
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
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
    }

    async function bookAppointment() {
        if (!selectedSlot) {
            setMessage("Selecciona un horario antes de continuar.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        date,
                        start_time: selectedSlot.start_time
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "No se pudo reservar. Consulta nuevamente los horarios."
                );

                if (response.status === 409) {
                    setSelectedSlot(null);
                }

                return;
            }

            setMessage(
                `¡Cita reservada! Fecha: ${date}, horario: ` +
                `${data.appointment.start_time.slice(0, 5)}.`
            );

            setSelectedSlot(null);
            await searchSlotsAfterBooking(date);
        } catch (error) {
            console.error(error);
            setMessage("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    }

    async function searchSlotsAfterBooking(selectedDate) {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:8000/api/available-slots?date=${selectedDate}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSlots(data.slots || []);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
    <main className="book-appointment-section">
        <div className="book-appointment-container">

            {/* Búsqueda de fecha */}
            <section className="book-appointment-card">
                <h1>Reservar una cita</h1>

                <p className="book-appointment-description">
                    Selecciona una fecha para consultar los horarios
                    disponibles en el consultorio.
                </p>

                <form
                    className="book-appointment-form"
                    onSubmit={searchSlots}
                >
                    <div className="book-appointment-field">
                        <label
                            className="book-appointment-label"
                            htmlFor="appointment-date"
                        >
                            Fecha de la cita
                        </label>

                        <input
                            className="book-appointment-input"
                            id="appointment-date"
                            type="date"
                            value={date}
                            min={localToday}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="book-appointment-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Consultando..."
                            : "Consultar horarios"}
                    </button>
                </form>

                {message && (
                    <p
                        className="book-appointment-message"
                        role="status"
                    >
                        {message}
                    </p>
                )}
            </section>

            {/* Horarios disponibles */}
            {slots.length > 0 && (
                <section className="book-appointment-card">
                    <h2>Horarios disponibles</h2>

                    <div className="book-appointment-slots">
                        {slots.map((slot) => (
                            <button
                                className={`book-appointment-slot ${
                                    selectedSlot?.start_time === slot.start_time
                                        ? "selected"
                                        : ""
                                }`}
                                type="button"
                                key={slot.start_time}
                                disabled={loading}
                                aria-pressed={
                                    selectedSlot?.start_time === slot.start_time
                                }
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {slot.start_time.slice(0, 5)}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Confirmación */}
            {selectedSlot && (
                <section className="book-appointment-card">
                    <h2>Confirmar cita</h2>

                    <div className="book-appointment-summary">
                        <p>
                            <strong>Fecha:</strong> {date}
                        </p>

                        <p>
                            <strong>Horario:</strong>{" "}
                            {selectedSlot.start_time.slice(0, 5)}
                            {" - "}
                            {selectedSlot.end_time.slice(0, 5)}
                        </p>
                    </div>

                    <button
                        className="book-appointment-button book-appointment-confirm"
                        type="button"
                        onClick={bookAppointment}
                        disabled={loading}
                    >
                        {loading
                            ? "Procesando..."
                            : "Confirmar reserva"}
                    </button>
                </section>
            )}

            {/* Navegación */}
            <nav className="book-appointment-links">
                <Link to="/available-schedules">
                    Consultar horarios
                </Link>

                <span aria-hidden="true">·</span>

                <Link to="/login">
                    Volver al inicio de sesión
                </Link>
            </nav>

        </div>
    </main>
);

}

export default BookAppointment;
