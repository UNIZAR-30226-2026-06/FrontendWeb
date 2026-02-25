import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/PrivateActionSelector.css";

const PrivateActionSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mode } = location.state || { mode: "roles" };

  const config = {
    roles: { title: "Modo con roles", icon: "🎭" },
    cards: { title: "Modo cartas", icon: "⚡" }
  };

  const current = config[mode] || config.roles;

  const handleChoice = (type) =>{
    if (type === 'ia'){
      const route = mode === "roles" ? "/modeRols" : "/modeCards";
      navigate(route,{ state: {mode, isPublic: false, isMultiplayer: false}});
    } else {
      navigate("/container", {state: {mode, isPublic: false, isMultiplayer: true}});
    }
  };

  return (
    <div className="pa-overlay">
      <div className="pa-card">
        <button className="ps-back-btn pa-back" onClick={() => navigate("/home")}>
          <span className="arrow">↩</span> Volver
        </button>

        <h1 className="pa-main-title">UNO</h1>
        
        <div className="pa-mode-info">
          <span className="pa-icon">{current.icon}</span>
          <div>
            <h2 className="pa-mode-title">{current.title}</h2>
            <p className="pa-subtitle">Partida Privada</p>
          </div>
        </div>

        <p className="pa-instruction">Selecciona el modo de juego</p>

        <div className="pa-buttons-container">
          <button className="pa-btn btn-ia" onClick={() => handleChoice('ia')}>
            <span className="btn-title">Jugar vs IA</span>
            <span className="btn-desc">Compite contra la IA en frenéticas partidas</span>
          </button>

          <button className="pa-btn btn-multi" onClick={() => handleChoice('multi')}>
            <span className="btn-title">Modo Multijugador</span>
            <span className="btn-desc">Desafía a otros rivales para demostrar quien es el mejor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateActionSelector;