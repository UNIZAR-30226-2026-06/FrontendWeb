import React, { useState } from "react";
import GameHeader from "../components/GameHeader";
import GameBoard from "../components/GameBoard";
import SettingsModal from "../components/SettingsModal";
import "../styles/GameScreen.css";

const Game = () => {
  const [showSettings, setShowSettings] = useState(false);

  const myCards = [
    { value: "3", color: "blue" },
    { value: "1", color: "blue" },
    { value: "1", color: "blue" },
    { value: "7", color: "blue" },
    { value: "5", color: "blue" }
  ];
  const currentTableCard = { value: "7", color: "blue" };

  return (
    <div className="game-full-layout">
      <GameHeader 
        onMenuClick={() => setShowSettings(true)} 
      />

      <GameBoard 
        myCards={myCards} 
        currentTableCard={currentTableCard} 
      />

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Game;