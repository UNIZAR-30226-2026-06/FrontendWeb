import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/ConnectionSelector.css"; 

const JoinPartySelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomCode, setRoomCode] = useState("");
  
  const { mode } = location.state || { mode: "roles" };

  const config = {
    roles: { title: "Modo con roles", icon: "🎭" },
    cards: { title: "Modo cartas", icon: "⚡" }
  };

  const { title, icon } = config[mode] || config.roles;

  const handleJoin = () => {
    if (roomCode.trim().length > 0) {
      playSound('success');
      console.log(`Uniéndose a la partida ${roomCode} en modo ${mode}`);
      navigate("/loading", { state: { mode, roomCode, type: 'join' } });
    } else {
      alert("Por favor, introduce un código válido");
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
            <p className="conn-subtitle">Partida Privada</p>
          </div>
        </div>

        <div className="join-input-group">
          <label className="join-label">Código de la partida:</label>
          <input 
            type="text" 
            className="join-input"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={6}
          />
        </div>

        <button className="ps-start-btn conn-btn join-confirm-btn" onClick={handleJoin}>
          Unirse partida
        </button>
      </div>
    </div>
  );
};

export default JoinPartySelector;