import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "/img/logo.png";
import GameModeCard from "../components/GameModeCard";
import HomeNavigation from "../components/HomeNavigation";
import { getMyProfile } from "../services/userService";
import { playSound } from "../utils/sounds";
import AnimatedCoins from "../components/AnimatedCoins";
import "../styles/Home.css";

const MODES = [
  { title: "Modo con roles", desc: "Roles únicos y habilidades especiales.", color: "#2A2D6E", icon: "🎭" },
  { title: "Modo cartas", desc: "Nuevas cartas que modifican las reglas del juego.", color: "#2A2D6E", icon: "⚡" },
  { title: "Modo personalizado", desc: "Haz el juego a tu medida, cartas y roles fusionados.", color: "#2A2D6E", icon: "🛠️" },
  { title: "Partidas Pausadas", desc: "Reanuda tus partidas privadas.", color: "#2A2D6E", icon: "⏸️" }
];

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [username, setUsername] = useState("Jugador1");
  const [userAvatar, setUserAvatar] = useState("👤");
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getMyProfile();
        
        setUsername(profile.nombre_usuario || "Jugador1");
        setCoins(profile.monedas || 0);
        
        const savedAvatar = localStorage.getItem("userAvatar");
        if (savedAvatar) {
          setUserAvatar(savedAvatar);
        } else {
          setUserAvatar("👤");
        }
      } catch (error) {
        const savedName = localStorage.getItem("username");
        if (savedName) setUsername(savedName);
      }
    };

    loadData();
  }, []);

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

  const handleNavigate = (title, isPrivate) => {
    playSound('click');
    const modeKey = title === "Modo con roles" ? "roles" : "cards";
    const route = modeKey === "roles" ? "/modeRols" : "/modeCards";

    if (title === "Modo personalizado") {
      navigate("/partidaPersonalizada");
      return;
    }

    if (title === "Partidas Pausadas") {
      navigate("/partidasPausadas");
      return;
    }

    if (isPrivate) {
      navigate("/private-action", { state: { mode: modeKey } });
    } else {
      navigate(route, {state: {mode: modeKey, isPublic: true, isMultiplayer: true}});
    }
  };

  const renderAvatar = () => {
    if (userAvatar?.includes('.') || userAvatar?.includes('/')) {
      return <img src={userAvatar} alt="Avatar" className="user-avatar-mini" />;
    }
    return <span className="user-emoji-mini">{userAvatar || "👤"}</span>;
  };

  return (
    <div className="home-screen">
      <div className="main-card">
        <header className="top-bar">
          <div className="logo">
            <img src={logoImg} alt="Logo Uno Not" className="logo-img" />
          </div>
          <div className="user-stats">
            <AnimatedCoins coins={coins} className="stat coins" />
            <button className="stat user clickable-user" onClick={() => navigate("/profile")}>
              {renderAvatar()} {username}
            </button>
          </div>
        </header>
        <div className="home-content">
          <h1>¡Bienvenido, {username}!</h1>
          <p className="subtitle">Elige un modo de juego para empezar</p>

          <div className="carousel-wrapper">
            <button className="button-3d" onClick={() => {playSound('slide'); scroll(-1)}}>
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
                  onPublic={() => handleNavigate(m.title, false)} 
                  onPrivate={() => handleNavigate(m.title, true)}
                />
              ))}
            </div>

            <button className="button-3d" onClick={() => {playSound('slide'); scroll(1)}}>
              <div className="button-top">
                <span className="nav-icon-3d">❯</span>
              </div>
              <div className="button-bottom"></div>
              <div className="button-base"></div>
            </button>
          </div>

          <HomeNavigation />
        </div>
      </div>
    </div>
  );
}