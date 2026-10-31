import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminBookAppointment.css";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api`;

function AdminBookAppointment() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const token = localStorage.getItem("token");

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function loadSlots() {
    setError("");
    setMessage("");
    setSlots([]);
    setStartTime("");

    if (!date) {
      setError("Selecciona una fecha.");
      return;
    }

    setLoadingSlots(true);

    try {
      const response = await fetch(
        `${API_URL}/available-slots?date=${date}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudieron consultar los horarios."
        );
      }

      setSlots(data.slots || []);

      if (!data.slots?.length) {
        setMessage("No hay horarios disponibles para esta fecha.");
      }
    } catch (err) {
      setError(err.message || "Error al consultar horarios.");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !date || !startTime) {
      setError("Completa el correo, la fecha y el horario.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/admin/appointments/manual`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            date,
            start_time: startTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudo registrar la cita."
        );
      }

      setMessage(
        `Cita registrada correctamente para ${
          data.appointment.user?.name || email
        }, el ${date} a las ${startTime}.`
      );

      setEmail("");
      setStartTime("");

      await loadSlots();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al registrar la cita."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-book-page">
      <div className="admin-book-container">
        <header className="admin-book-header">
          <span className="admin-book-eyebrow">
            PANEL ADMINISTRATIVO
          </span>

          <h1>Registrar cita manual</h1>

          <p>
            Registra las citas de pacientes que solicitan atención
            por teléfono o directamente en el consultorio.
          </p>
        </header>

        {message && (
          <p className="admin-book-alert success" role="status">
            <span className="admin-book-alert-icon">✓</span>
            {message}
          </p>
        )}

        {error && (
          <p className="admin-book-alert error" role="alert">
            <span className="admin-book-alert-icon">!</span>
            {error}
          </p>
        )}

        <section className="admin-book-card">
          <div className="admin-book-card-heading">
            <div className="admin-book-heading-icon">✚</div>

            <div>
              <h2>Datos de la cita</h2>
              <p>Completa los datos para registrar la reservación.</p>
            </div>
          </div>

          <form
            className="admin-book-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-book-field">
              <label htmlFor="patient-email">
                Correo electrónico del paciente
              </label>

              <input
                id="patient-email"
                type="email"
                placeholder="paciente@correo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <span className="admin-book-hint">
                Utiliza el correo asociado a la cuenta del paciente.
              </span>
            </div>

            <div className="admin-book-field">
              <label htmlFor="appointment-date">
                Fecha de la cita
              </label>

              <input
                id="appointment-date"
                type="date"
                min={localToday}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSlots([]);
                  setStartTime("");
                  setMessage("");
                  setError("");
                }}
                required
              />
            </div>

            <div className="admin-book-field">
              <label htmlFor="appointment-time">
                Horario disponible
              </label>

              <div className="admin-book-slot-row">
                <select
                  id="appointment-time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                  disabled={slots.length === 0 || loadingSlots}
                >
                  <option value="">
                    {slots.length
                      ? "Selecciona un horario"
                      : "Primero consulta los horarios"}
                  </option>

                  {slots.map((slot) => (
                    <option
                      key={slot.start_time}
                      value={slot.start_time.slice(0, 5)}
                    >
                      {slot.start_time.slice(0, 5)} -{" "}
                      {slot.end_time.slice(0, 5)}
                    </option>
                  ))}
                </select>

                <button
                  className="admin-book-secondary-button"
                  type="button"
                  onClick={loadSlots}
                  disabled={!date || loadingSlots || loading}
                >
                  {loadingSlots ? "Consultando..." : "Consultar"}
                </button>
              </div>

              <span className="admin-book-hint">
                Selecciona una fecha y consulta los horarios antes de
                elegir uno.
              </span>
            </div>

            {startTime && (
              <div className="admin-book-selection">
                <span className="admin-book-selection-icon">✓</span>
                <div>
                  <strong>Horario seleccionado</strong>
                  <p>
                    {date} · {startTime}
                  </p>
                </div>
              </div>
            )}

            <button
              className="admin-book-submit-button"
              type="submit"
              disabled={loading || loadingSlots}
            >
              {loading ? "Registrando cita..." : "Registrar cita"}
            </button>
          </form>
        </section>

        <footer className="admin-book-footer">
          <Link to="/admin/appointments">
            ← Volver a administración de citas
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default AdminBookAppointment;