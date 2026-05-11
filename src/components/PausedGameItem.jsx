import React from "react";
import "../styles/FriendsItem.css"; 

const PausedGameItem = ({ game, onResume }) => {
  const dateFormatted = new Date(game.fecha || Date.now()).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="friend-item-row">
      <div className="friend-info-group">
        <div className="avatar-container">
          <span className="avatar-emoji">⏳</span>
        </div>
        
        <div className="friend-text-column">
          <span className="friend-name-top">Partida #{game.id_partida?.slice(-6).toUpperCase()}</span>
          <div className="friend-details-bottom">
            <span className="status-text" style={{ color: "#f1c40f" }}>Pausada</span>
            <span className="separator-dot">•</span>
            <span className="coins-text">{dateFormatted}</span>
          </div>
        </div>
      </div>

      <div className="friend-actions">
        <button className="btn-add-friend" onClick={() => onResume(game.id_partida)}>
          <span className="add-icon">▶</span> Reanudar
        </button>
      </div>
    </div>
  );
};

export default PausedGameItem;