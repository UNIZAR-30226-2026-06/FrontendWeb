import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../img/logo.png";
import GameModeCard from "../components/GameModeCard";
import HomeNavigation from "../components/HomeNavigation";
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
      const card = scrollRef.current.querySelector(".game-card-container");
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
            <button className="button-3d" onClick={() => scroll(-1)}>
              <div className="button-top">
                <span className="nav-icon-3d">❮</span>
              </div>
              <div className="button-bottom"></div>
              <div className="button-base"></div>
            </button>
            
            <div className="modes-container" ref={scrollRef}>
              {MODES.map((m, i) => (
                <GameModeCard 
                  key={i} 
                  mode={m} 
                  onPublic={() => navigate("/game")} 
                  onPrivate={() => navigate("/game")}
                />
              ))}
            </div>

            <button className="button-3d" onClick={() => scroll(1)}>
              <div className="button-top">
                <span className="nav-icon-3d">❯</span>
              </div>
              <div className="button-bottom"></div>
              <div className="button-base"></div>
            </button>
          </div>

          {/* Menú Inferior */}
          <HomeNavigation />
        </div>
      </div>
    </div>
  );
}