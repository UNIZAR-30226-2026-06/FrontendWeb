import React from "react";
import GameHeader from "./GameHeader";
import GameBoard from "./GameBoard";
import "../styles/GameScreen.css";

const GameScreen = () => {
  const myCards = [
    { value: "3", color: "blue", type: "normal" },
    { value: "1", color: "blue", type: "normal" },
    { value: "1", color: "blue", type: "normal" },
    { value: "7", color: "blue", type: "normal" },
    { value: "5", color: "blue", type: "normal" },
  ];

  const currentTableCard = { value: "7", color: "blue", type: "normal" };

  return (
    <div 
      className="game-full-layout" 
      style={{ 
        /* Ruta directa a la carpeta public/img/ */
        backgroundImage: "url('/img/fondo1.jpeg')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <GameHeader pausedCount={1} totalPlayers={4} />

      <GameBoard 
        myCards={myCards} 
        currentTableCard={currentTableCard} 
      />
    </div>
  );
};

export default GameScreen;