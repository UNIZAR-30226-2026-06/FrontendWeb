import React from "react";
import "../styles/GameModeCard.css";

const GameModeCard = ({ mode, onPublic, onPrivate }) => {
  const isSingleActionButton = mode.title === "Modo personalizado" || mode.title === "Partidas Pausadas";
  return (
    <div className="game-card-container">
      <div className="card-inner">
        <div className="card-front">
          <div className="bg-circles">
            <div className="circle"></div>
            <div className="circle" id="right"></div>
            <div className="circle" id="bottom"></div>
          </div>
          <div className="front-content">
            <small className="badge">Modo de Juego</small>
            <div className="description">
              <div className="title-row">
                <strong>{mode.title}</strong>
                <span className="mode-icon-mini">{mode.icon}</span>
              </div>
              <p className="card-footer-text">Pasa por encima para ver opciones</p>
            </div>
          </div>
        </div>

        <div className="card-back">
          <div className="back-content">
             <h3>{mode.title}</h3>
             <p>{mode.desc}</p>
             <div className="back-buttons">
                {isSingleActionButton ? (
                  <button className="btn-single" onClick={onPublic}>
                    {mode.title === "Modo personalizado" ? "Crear Partida" : "Reanudar"}
                  </button>
                ) : (
                  <>
                    <button className="btn-public" onClick={onPublic}>Partida Pública</button>
                    <button className="btn-private" onClick={onPrivate}>Partida Privada</button>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeCard;