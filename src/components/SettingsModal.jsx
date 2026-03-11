import React from "react";
import "../styles/SettingsModal.css";

const SettingsModal = ({ onClose }) => {
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

  return (
    <div className="modal-overlay">
      <div className="settings-panel">
        <button className="close-modal-x" onClick={onClose}>✖</button>
        
        <h2 className="settings-title-green">AJUSTES</h2>

        <div className="settings-body">
          <div className="rules-section">
            <label className="rules-label-white">REGLAS</label>
            <div className="rules-inner-box"></div>
          </div>

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