import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../styles/Appointments.css";

const API_URL = "http://127.0.0.1:8000/api";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  async function loadAppointments() {
    setLoading(true);
    setError("");

    if (!token) {
      setError("Inicia sesión para consultar tus citas.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/my-appointments`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudieron cargar las citas.");
      }

      setAppointments(
        Array.isArray(data) ? data : data.appointments || []
      );
    } catch (err) {
      setError(err.message || "Ocurrió un error al consultar las citas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function cancelAppointment(id) {
    const confirmed = window.confirm(
      "¿Seguro que deseas cancelar esta cita?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/my-appointments/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo cancelar la cita.");
      }

      setMessage(data.message || "La cita se canceló correctamente.");
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Ocurrió un error al cancelar.");
    }
  }

  function formatDate(date) {
    if (!date) return "No disponible";

    const dateOnly = date.split("T")[0];
    const [year, month, day] = dateOnly.split("-");

    return `${day}/${month}/${year}`;
  }


  function formatTime(time) {
    return time?.slice(0, 5) || "";
  }

  function formatStatus(status) {
    const statuses = {
      confirmed: "Confirmada",
      completed: "Atendida",
      cancelled: "Cancelada",
      pending: "Pendiente",
    };

    return statuses[status] || status;
  }

  return (
    <main className="appointments-page">
      <div className="appointments-container">
        <header className="appointments-header">
          <div>
            <span className="appointments-eyebrow">
              CONSULTORIO DENTAL
            </span>
            <h1>Mis citas</h1>
            <p>
              Consulta y administra tus próximas citas dentales.
            </p>
          </div>

          <Link
            className="appointments-link-button"
            to="/horarios"
          >
            + Consultar horarios
          </Link>
        </header>

        {message && (
          <p className="appointments-alert success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="appointments-alert error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="appointments-empty">
            <div className="appointments-loader" />
            <p>Cargando tus citas...</p>
          </div>
        ) : appointments.length === 0 ? (
          <section className="appointments-empty">
            <div className="appointments-empty-icon">▦</div>
            <h2>Aún no tienes citas</h2>
            <p>
              Cuando reserves una cita, podrás consultar aquí la fecha,
              el horario y su estado.
            </p>
            <Link className="appointments-primary-button" to="/reservar">
              Reservar una cita
            </Link>
          </section>
        ) : (
          <>
            <div className="appointments-section-heading">
              <h2>Tu historial de citas</h2>
              <span>
                {appointments.length}{" "}
                {appointments.length === 1 ? "cita registrada" : "citas registradas"}
              </span>
            </div>

            <section className="appointments-list">
              {appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="appointment-card"
                >
                  <div className="appointment-card-header">
                    <div className="appointment-icon">✚</div>
                    <div className="appointment-card-title">
                      <h3>Cita #{appointment.id}</h3>
                      <p>Consultorio dental</p>
                    </div>

                    <span
                      className={`appointment-status status-${appointment.status}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </div>

                  <div className="appointment-details">
                    <div className="appointment-detail">
                      <span className="appointment-detail-label">
                        FECHA
                      </span>
                      <strong>
                        {formatDate(appointment.appointment_date)}
                      </strong>
                    </div>

                    <div className="appointment-detail">
                      <span className="appointment-detail-label">
                        HORARIO
                      </span>
                      <strong>
                        {formatTime(appointment.start_time)} -{" "}
                        {formatTime(appointment.end_time)}
                      </strong>
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <div className="appointment-card-actions">
                      <button
                        className="appointment-cancel-button"
                        type="button"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        Cancelar cita
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </section>
          </>
        )}

        <footer className="appointments-footer">
          <Link to="/login">Volver al inicio de sesión</Link>
        </footer>
      </div>
    </main>
  );
}

export default MyAppointments;