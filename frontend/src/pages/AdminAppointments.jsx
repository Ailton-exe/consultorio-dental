import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../styles/Appointments.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/appointments`, {
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
      setError(err.message || "Error al consultar las citas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id, status) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar el estado.");
      }

      setMessage(data.message || "Estado actualizado.");
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Error al actualizar la cita.");
    }
  }

  function formatDate(date) {
    if (!date) return "No disponible";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
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
              PANEL ADMINISTRATIVO
            </span>
            <h1>Administración de citas</h1>
            <p>
              Consulta las citas de los pacientes y administra su estado.
            </p>
          </div>

          <Link
            className="appointments-link-button"
            to="/admin/horarios"
          >
            Administrar horarios
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
            <p>Cargando citas...</p>
          </div>
        ) : appointments.length === 0 ? (
          <section className="appointments-empty">
            <div className="appointments-empty-icon">▦</div>
            <h2>No hay citas registradas</h2>
            <p>
              Las citas de los pacientes aparecerán aquí cuando se registren.
            </p>
          </section>
        ) : (
          <>
            <div className="appointments-section-heading">
              <h2>Citas registradas</h2>
              <span>
                {appointments.length}{" "}
                {appointments.length === 1 ? "cita registrada" : "citas registradas"}
              </span>
            </div>

            <section className="appointments-list">
              {appointments.map((appointment) => (
                <article
                  className="appointment-card"
                  key={appointment.id}
                >
                  <div className="appointment-card-header">
                    <div className="appointment-icon">✚</div>
                    <div className="appointment-card-title">
                      <h3>Cita #{appointment.id}</h3>
                      <p>
                        {appointment.user?.name || "Paciente sin nombre"}
                      </p>
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
                        CORREO DEL PACIENTE
                      </span>
                      <strong className="appointment-email">
                        {appointment.user?.email || "No disponible"}
                      </strong>
                    </div>

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
                        {appointment.start_time?.slice(0, 5)} -{" "}
                        {appointment.end_time?.slice(0, 5)}
                      </strong>
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <div className="appointment-card-actions">
                      <button
                        className="appointment-complete-button"
                        type="button"
                        onClick={() =>
                          updateStatus(appointment.id, "completed")
                        }
                      >
                        Marcar como atendida
                      </button>

                      <button
                        className="appointment-cancel-button"
                        type="button"
                        onClick={() => {
                          if (window.confirm("¿Cancelar esta cita?")) {
                            updateStatus(appointment.id, "cancelled");
                          }
                        }}
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
          <Link to="/admin/book-appointment">Registrar cita manual</Link>
          <Link to="/login">Volver al inicio de sesión</Link>
        </footer>
      </div>
    </main>
  );
}

export default AdminAppointments;