import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/ConnectionSelector.css"; 
import "../styles/CustomGameSelector.css"; 

const CustomGameSelector = () => {
  const navigate = useNavigate();
  
  const [selectedMode, setSelectedMode] = useState("normal");
  const [numCartas, setNumCartas] = useState(7);

  const modes = [
    { id: "normal", label: "Normal", icon: "🎴" },
    { id: "roles", label: "Roles", icon: "🎭" },
    { id: "cartas", label: "Cartas esp.", icon: "⚡" },
  ];

  const handleAdjustCartas = (amount) => {
    const nuevoValor = numCartas + amount;
    if (nuevoValor >= 5 && nuevoValor <= 15) {
      playSound('click');
      setNumCartas(nuevoValor);
    }
  };

  const handleCreate = () => {
    playSound('success');
    navigate("/loading", { 
      state: { 
        mode: selectedMode, 
        initialCards: numCartas,
        type: 'custom' 
      } 
    });
  };

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
             <p className="conn-mini-text">Partida Privada</p>
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
                  className={`option-item ${selectedMode === m.id ? 'active' : ''}`}
                  onClick={() => setSelectedMode(m.id)}
                >
                  <div className="option-icon-box">
                    <span className="option-icon">{m.icon}</span>
                  </div>
                  <span className="option-label">{m.label}</span>
                </div>
              ))}

              <div className="option-item no-click">
                <div className="option-icon-box num-cards-selector">
                  <button onClick={() => handleAdjustCartas(-1)}>-</button>
                  <span className="num-display">{numCartas}</span>
                  <button onClick={() => handleAdjustCartas(1)}>+</button>
                </div>
                <span className="option-label">Num cartas</span>
              </div>
            </div>
          </div>

          <button className="ps-start-btn custom-create-btn" onClick={handleCreate}>
            Crear partida
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomGameSelector;