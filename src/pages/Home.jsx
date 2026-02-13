import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../img/logo.png";
import "../styles/Home.css";

const MODES = [
  { title: "Modo con roles", desc: "Roles únicos y habilidades especiales.", color: "#2A2D6E", icon: "🎭" },
  { title: "Modo cartas", desc: "Nuevas cartas que modifican las reglas del juego.", color: "#2A2D6E", icon: "⚡" },
  { title: "Modo personalizado", desc: "Haz el juego a tu medida, cartas y roles fusionados.", color: "#2A2D6E", icon: "🛠️" },
  { title: "Partidas Pausadas", desc: "Reanuda tus partidas privadas.", color: "#2A2D6E", icon: "🛠️" }
];

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector(".mode-card");
      if (card) {
        const cardWidth = card.offsetWidth; 
        const gap = 20;
        
        scrollRef.current.scrollBy({
          left: (cardWidth + gap) * direction,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="home-screen">
      <div className="main-card">
        {/* Header: Logo, Monedas y Perfil */}
        <header className="top-bar">
          <div className="logo">
            <img src={logoImg} alt="Logo Uno Not" className="logo-img" />
          </div>
          <div className="user-stats">
            <div className="stat coins">💰 500</div>
            <button className="stat user clickable-user" onClick={() => navigate("/profile")} aria-label="Ver perfil de usuario">
              👤 Jugador1
            </button>
          </div>
        </header>
        <div className="home-content">
          <h1>¡Bienvenido!</h1>
          <p className="subtitle">Elige un modo de juego para empezar</p>

          {/* Carrusel */}
          <div className="carousel-wrapper">
            <button className="nav-arrow" onClick={() => scroll(-1)}>❮</button>
            
            <div className="modes-container" ref={scrollRef}>
              {MODES.map((m, i) => (
                <div key={i} className="mode-card">
                  <div className="mode-header">
                    <span className="mode-icon">{m.icon}</span>
                    <h3>{m.title}</h3>
                  </div>
                  <p>{m.desc}</p>
                  <div className="mode-buttons">
                    <button className="btn-public" onClick={() => navigate("/game")}>Partida pública</button>
                    <button className="btn-private" onClick={() => navigate("/game")}>Partida privada</button>
                  </div>
                </div>
              ))}
            </div>

            <button className="nav-arrow" onClick={() => scroll(1)}>❯</button>
          </div>

          {/* Menú Inferior */}
          <footer className="bottom-nav">
            <button className="nav-item">
              <span className="nav-icon">👥</span> Amigos
            </button>
            <button className="nav-item">
              <span className="nav-icon">🏪</span> Tienda
            </button>
            <button className="nav-item">
              <span className="nav-icon">👤</span> Perfil
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}