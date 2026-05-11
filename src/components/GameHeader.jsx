import React, { useState, useEffect } from "react";
import "../styles/GameHeader.css";

const GameHeader = ({
  logoSrc,
  pausedCount = 0,
  totalPlayers = 0,
  pauseVoteActive = false,
  myPauseVote = false,
  onPauseClick,
  onMenuClick,
  onChatClick,
  showPause = true
}) => {
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

  const pauseLabel = pauseVoteActive
    ? `⏸ Pausando... (${pausedCount}/${totalPlayers})`
    : myPauseVote
    ? `⏸ Votado (${pausedCount}/${totalPlayers})`
    : "❚❚ PAUSAR";

  return (
    <header className="game-header-top">
      <div className="header-left">
        <img src={logoSrc || "/img/logo.png"} alt="Logo" className="header-logo" />
      </div>

      <div className="header-center">
        <span className="digital-clock">{formatTime(seconds)}</span>
        {showPause && (
          <button
            className={`pause-pill ${pauseVoteActive || myPauseVote ? "pause-pill-active" : ""}`}
            onClick={onPauseClick}
            disabled={myPauseVote}
            title={myPauseVote ? "Ya has votado pausar" : "Solicitar pausa (requiere unanimidad)"}
          >
            {pauseLabel}
          </button>
        )}
      </div>

      <div className="header-right">
        {onChatClick && (
          <button className="chat-btn" onClick={onChatClick} title="Chat">💬</button>
        )}
        <button className="burger-menu-btn" onClick={onMenuClick}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
};

export default GameHeader;