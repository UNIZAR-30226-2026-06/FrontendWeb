import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/ConnectionSelector.css"; 
import "../styles/CustomGameSelector.css"; 

const CustomGameSelector = ({ onStart }) => {
  const navigate = useNavigate();
  const [selectedModes, setSelectedModes] = useState({ normal: true, roles: false, cartas: false });
  const [numCartas, setNumCartas] = useState(7);

  const modes = [
    { id: "normal", label: "Normal", icon: "🎴" },
    { id: "roles", label: "Roles", icon: "🎭" },
    { id: "cartas", label: "Cartas esp.", icon: "⚡" },
  ];

  const toggleMode = (id) => {
    playSound("click");
    setSelectedModes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const algunActivo = Object.values(next).some(Boolean);
      return algunActivo ? next : prev;
    });
  };

  const handleAdjustCartas = (amount) => {
    const nuevoValor = numCartas + amount;
    if (nuevoValor >= 5 && nuevoValor <= 15) {
      playSound("click");
      setNumCartas(nuevoValor);
    }
  };

  const buildConfig = () => ({ customFlags: { ...selectedModes }, initialCards: numCartas, type: "custom" });

  const handleCreate = () => {
    playSound("success");
    if (onStart) onStart(buildConfig());
  };

  const handleJoin = () => {
    playSound("click");
    navigate("/customJoin", { state: buildConfig() });
  };

  const summaryText = modes
    .filter((m) => selectedModes[m.id])
    .map((m) => m.label)
    .join(" + ");

  return (
    <div className="conn-overlay">
      <div className="conn-card custom-card">
        <button className="ps-back-btn conn-back" onClick={() => navigate(-1)}>
          <span className="arrow">↩</span> Volver
        </button>

        <h1 className="conn-main-title">UNO</h1>
        <div className="custom-subtitle-group">
          <span className="edit-icon">✎</span>
          <div>
            <h2 className="conn-mode-title">Partida personalizada</h2>
            <p className="conn-mini-text">
              {summaryText || "Selecciona al menos un modo"}
            </p>
          </div>
        </div>

        <div className="create-room-panel">
          <h3 className="panel-title">CREAR SALA</h3>
          <div className="rules-section-custom">
            <h4 className="rules-label-main">Reglas</h4>
            <div className="options-grid">
              {modes.map((m) => (
                <div 
                  key={m.id}
                  className={`option-item ${selectedModes[m.id] ? "active" : ""}`}
                  onClick={() => toggleMode(m.id)}
                >
                  <div className="option-icon-box">
                    <span className="option-icon">{m.icon}</span>
                    {selectedModes[m.id] && (
                      <span className="option-check">✓</span>
                    )}
                  </div>
                  <span className="option-label">{m.label}</span>
                </div>
              ))}

              <div className="option-item no-click">
                <div className="option-icon-box num-cards-selector">
                  <button onClick={() => handleAdjustCartas(-1)} disabled={numCartas <= 5}>
                    -
                  </button>
                  <span className="num-display">{numCartas}</span>
                  <button onClick={() => handleAdjustCartas(1)} disabled={numCartas >= 15}>
                    +
                  </button>
                </div>
                <span className="option-label">Num cartas</span>
              </div>
            </div>

            <p className="custom-hint">
              Puedes activar varios modos a la vez. Mínimo 5, máximo 15 cartas.
            </p>
          </div>

          <div className="custom-actions-group">
            <button className="ps-start-btn custom-create-btn"onClick={handleCreate}>
              Crear partida
            </button>
            <button className="ps-start-btn custom-join-btn" onClick={handleJoin}>
              Unirse a partida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGameSelector;