import React, { useState, useEffect } from "react";
import "../styles/GameHeader.css";

const GameHeader = ({ logoSrc, pausedCount = 1, totalPlayers = 4, onMenuClick }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <header className="game-header-top">
      <div className="header-left">
        <img src={logoSrc || "../img/logo.png"} alt="Logo" className="header-logo" />
      </div>

      <div className="header-center">
        <span className="digital-clock">{formatTime(seconds)}</span>
        <button className="pause-pill">
          <span className="pause-icon">❚❚</span> PAUSAR ({pausedCount}/{totalPlayers})
        </button>
      </div>

      <div className="header-right">
        <button className="burger-menu-btn" onClick={onMenuClick}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
};

export default GameHeader;