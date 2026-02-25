import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Lobby.css";

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mode, players = 4, roomCode = "ABCDEF" } = location.state || {};

  const config = {
    roles: { title: "Modo con roles", icon: "🎭" },
    cards: { title: "Modo cartas", icon: "⚡" },
    normal: { title: "Modo normal", icon: "🎴" }
  };

  const currentMode = config[mode] || config.roles;

  const connectedPlayers = [
    { id: 1, name: "Tú", isHost: true, ready: true, avatar: "T" },
    { id: 2, name: "Jugador 1", isHost: false, ready: false, avatar: "J" },
  ];

  return (
    <div className="lobby-overlay">
      <div className="lobby-card">
        <div className="lobby-header">
          <button className="ps-back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">↩</span> Salir
          </button>
          <div className="lobby-room-info">
            <span className="code-label">CÓDIGO DE SALA</span>
            <span className="code-value">{roomCode}</span>
          </div>
        </div>

        <div className="lobby-mode-display">
          <span className="lobby-mode-icon">{currentMode.icon}</span>
          <div>
            <h2>Sala de Espera</h2>
            <p>{currentMode.title}</p>
          </div>
        </div>

        <div className="lobby-progress-container">
          <div className="lobby-stats">
            <span>Jugadores: {connectedPlayers.length}/{players}</span>
            <span>{Math.round((connectedPlayers.length / players) * 100)}%</span>
          </div>
          <div className="lobby-progress-bar">
            <div 
              className="lobby-progress-fill" 
              style={{ width: `${(connectedPlayers.length / players) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="lobby-players-grid">
          {Array.from({ length: players }).map((_, index) => {
            const player = connectedPlayers[index];
            return (
              <div key={index} className={`player-slot ${player ? 'occupied' : 'empty'}`}>
                {player ? (
                  <>
                    <div className="player-avatar">{player.avatar}</div>
                    <div className="player-info">
                      <span className="player-name">
                        {player.name} {player.isHost && <span className="host-crown">👑</span>}
                      </span>
                      <span className={`player-status ${player.ready ? 'ready' : 'waiting'}`}>
                        {player.ready ? "LISTO" : "PREPARANDO..."}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="slot-empty-text">Esperando jugador...</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="lobby-actions">
          <button 
            className="ps-start-btn lobby-btn" 
            disabled={connectedPlayers.length < 2}
          >
            Comenzar partida
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;