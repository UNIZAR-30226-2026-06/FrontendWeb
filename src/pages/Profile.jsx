import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="home-screen">
      <div className="main-card perfil-card">
        {/* Botón para volver atrás */}
        <header className="top-bar">
          <button className="nav-arrow back-btn" onClick={() => navigate(-1)}>❮ Volver</button>
          <h2>Mi Perfil</h2>
          <div className="stat coins">💰 500</div>
        </header>

        <div className="perfil-content">
          <div className="avatar-section">
            <div className="avatar-circle">👤</div>
            <h3>Jugador1</h3>
            <span className="user-tag">#1234</span>
          </div>

          <div className="stats-grid">
            <div className="stat-box"><span>Partidas</span><strong>45</strong></div>
            <div className="stat-box"><span>Victorias</span><strong>12</strong></div>
            <div className="stat-box"><span>Nivel</span><strong>5</strong></div>
          </div>

          <button className="btn-edit">Editar Avatar</button>
        </div>
      </div>
    </div>
  );
}