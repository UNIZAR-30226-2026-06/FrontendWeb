import React from "react";
import "../styles/SettingsModal.css";

const MODE_INFO = {
  roles: {
    icon: "🎭",
    title: "Modo Roles",
    desc: "Cada jugador recibe un rol secreto con habilidades especiales que puede activar durante la partida.",
  },
  cards: {
    icon: "⚡",
    title: "Modo Cartas Especiales",
    desc: "El mazo incluye cartas con efectos únicos que añaden giros inesperados al juego.",
  },
  custom: {
    icon: "🎮",
    title: "Partida Personalizada",
    desc: "Configuración a medida con los modos y número de cartas iniciales elegidos por el creador.",
  },
};

const SettingsModal = ({ onClose, mode, customFlags, isPublic }) => {
  const SwitchOption = ({ label }) => (
    <div className="setting-option-row">
      <span className="setting-text">{label}</span>
      <label className="switch-button">
        <div className="switch-outer">
          <input type="checkbox" defaultChecked={label !== "SONIDO"} />
          <div className="button-content">
            <div className="button-toggle"></div>
            <div className="button-indicator"></div>
          </div>
        </div>
      </label>
    </div>
  );

  const info = MODE_INFO[mode] ?? null;

  return (
    <div className="modal-overlay">
      <div className="settings-panel">
        <button className="close-modal-x" onClick={onClose}>✖</button>

        <h2 className="settings-title-green">AJUSTES</h2>

        {info && (
          <div className="game-info-block">
            <div className="game-info-icon">{info.icon}</div>
            <div className="game-info-text">
              <span className="game-info-title">{info.title}</span>
              <span className="game-info-desc">{info.desc}</span>
            </div>
          </div>
        )}

        <div className="settings-body">
          <div className="switches-container">
            <SwitchOption label="MÚSICA" />
            <SwitchOption label="VIBRACIÓN" />
            <SwitchOption label="SONIDO" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;