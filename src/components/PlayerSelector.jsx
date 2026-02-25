import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/PlayerSelector.css";

const PlayerSelector = ({ 
  title, 
  icon, 
  subtitle = "Partida vs IA", 
  minPlayers = 2, 
  maxPlayers = 4,
  rules = [],
  onStart,
  isMultiplayer = false
}) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(minPlayers);
  const [showRules, setShowRules] = useState(false);

  const handleAdjust = (amount) => {
    const newValue = count + amount;
    if (newValue >= minPlayers && newValue <= maxPlayers) {
      playSound('click'); 
      setCount(newValue);
    }
  };

  const handleStart = () => {
    playSound('success');
    if (onStart) onStart(count);
  };

  return (
    <div className="player-selector-overlay">
      <div className="player-selector-card">
        <div className="ps-header">
          <div className="ps-title-section">
            <span className="ps-icon">{icon}</span>
            <h2 className="ps-title">{title}</h2>
          </div>
          <button className="ps-back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">↩</span> Volver
          </button>
        </div>

        <div className="ps-mode-tag">{subtitle}</div>

        <div className="ps-selection-box">
          <p className="ps-label">Número de jugadores</p>
          
          <div className="ps-controls">
            <button 
              className="ps-minus" 
              onClick={() => handleAdjust(-1)}
              disabled={count <= minPlayers}
            >-</button>
            
            <div className="ps-number-display">
              <span className="ps-main-number">{count}</span>
              {!isMultiplayer && (
                <span className="ps-sub-text">1 humano + {count - 1} IA</span>
              )}
            </div>
            
            <button 
              className="ps-plus" 
              onClick={() => handleAdjust(1)}
              disabled={count >= maxPlayers}
            >+</button>
          </div>
          
          <p className="ps-limits">Mínimo {minPlayers}, máximo {maxPlayers} jugadores</p>
        </div>

        <button className="ps-start-btn" onClick={handleStart}>
          Comenzar partida
        </button>

        <div className="ps-rules-wrapper">
          <div 
            className={`ps-rules-header ${showRules ? 'active' : ''}`} 
            onClick={() => setShowRules(!showRules)}
          >
            <span className="ps-triangle">{showRules ? '▼' : '▶'}</span>
            <span className="ps-emoji">📋</span> Reglas del UNO
          </div>
          
          {showRules && (
            <ul className="ps-rules-list">
              {rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default PlayerSelector;