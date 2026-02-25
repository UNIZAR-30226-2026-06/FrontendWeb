import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/ConnectionSelector.css";

const ConnectionSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mode, isMultiplayer, isPublic } = location.state || { 
    mode: "roles", 
    isMultiplayer: true, 
    isPublic: false 
  };

  const config = {
    roles: { title: "Modo con roles", icon: "🎭" },
    cards: { title: "Modo cartas", icon: "⚡" }
  };

  const { title, icon } = config[mode] || config.roles;

  const handleAction = (type) => {
    playSound('click');
    
    const nextState = { mode, isMultiplayer, isPublic };

    if (type === 'create') {
      const route = mode === "roles" ? "/modeRols" : "/modeCards";
      navigate(route, { state: nextState });
    } else {
      navigate("/code", { state: nextState });
    }
  };

  return (
    <div className="conn-overlay">
      <div className="conn-card">
        <button className="ps-back-btn conn-back" onClick={() => navigate(-1)}>
          <span className="arrow">↩</span> Volver
        </button>

        <h1 className="conn-main-title">UNO</h1>

        <div className="conn-mode-info">
          <span className="conn-icon">{icon}</span>
          <div className="conn-texts">
            <h2 className="conn-mode-title">{title}</h2>
            <p className="conn-subtitle">Modo Multijugador</p>
            <p className="conn-mini-text">Partida Privada</p>
          </div>
        </div>

        <div className="conn-buttons-group">
          <button className="ps-start-btn conn-btn" onClick={() => handleAction('create')}>
            Crear partida
          </button>
          <button className="ps-start-btn conn-btn" onClick={() => handleAction('join')}>
            Unirse partida
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSelector;