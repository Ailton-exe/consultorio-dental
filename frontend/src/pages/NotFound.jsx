import { Link } from "react-router";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span className="not-found-code">404</span>

        <div className="not-found-icon">
          <span>!</span>
        </div>

        <h1>Página no encontrada</h1>

        <p>
          Lo sentimos, la página que buscas no existe o la dirección
          es incorrecta.
        </p>

        <Link to="/login" className="not-found-button">
          Volver al inicio de sesión
        </Link>

        <span className="not-found-footer">
          Sistema de reservas médicas
        </span>
      </section>
    </main>
  );
}

export default NotFound;