import React, { useState } from "react";
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

const getSetting = (key, def = true) => {
  const v = localStorage.getItem(`setting_${key}`);
  return v === null ? def : v === "true";
};

const SettingsModal = ({ onClose, mode }) => {
  const [sound,     setSound]     = useState(() => getSetting("sound"));
  const [music,     setMusic]     = useState(() => getSetting("music"));
  const [vibration, setVibration] = useState(() => getSetting("vibration"));

  const toggle = (key, value, setter) => {
    setter(value);
    localStorage.setItem(`setting_${key}`, String(value));
  };

  const SwitchOption = ({ label, checked, onChange }) => (
    <div className="setting-option-row">
      <span className="setting-text">{label}</span>
      <label className="switch-button">
        <div className="switch-outer">
          <input
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
          />
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
            <SwitchOption
              label="MÚSICA"
              checked={music}
              onChange={v => toggle("music", v, setMusic)}
            />
            <SwitchOption
              label="VIBRACIÓN"
              checked={vibration}
              onChange={v => toggle("vibration", v, setVibration)}
            />
            <SwitchOption
              label="SONIDO"
              checked={sound}
              onChange={v => toggle("sound", v, setSound)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;