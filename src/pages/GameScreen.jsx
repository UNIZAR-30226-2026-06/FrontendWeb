import React, { useState } from "react";
import GameHeader from "../components/GameHeader";
import GameBoard from "../components/GameBoard";
import SettingsModal from "../components/SettingsModal";
import "../styles/GameScreen.css";

const Game = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const myCards = [
    { value: "3", color: "blue", type: "normal" },
    { value: "1", color: "blue", type: "normal" },
    { value: "1", color: "blue", type: "normal" },
    { value: "7", color: "blue", type: "normal" },
    { value: "5", color: "blue", type: "normal" },
  ];

  const currentTableCard = { value: "7", color: "blue", type: "normal" };

  return (
    <div className="game-full-layout">
      <GameHeader 
        pausedCount={1} 
        totalPlayers={4} 
        onMenuClick={() => setIsSettingsOpen(true)} 
      />

      <GameBoard 
        myCards={myCards} 
        currentTableCard={currentTableCard} 
      />

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default Game;