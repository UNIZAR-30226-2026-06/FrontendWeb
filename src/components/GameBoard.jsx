import React from "react";
import Card from "../components/Card"; 
import "../styles/GameBoard.css"; 

export default function GameBoard() {
  const colors = ["blue", "red", "green", "yellow"];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  
  const specialActionCards = ["+2", "reverse", "+2R", "skip", "extraTurn", "playOdd", "playEven"]; 

  const fullDeck = colors.flatMap((color) => {
    const numeric = numbers.map((num) => ({
      id: `${color}-${num}`,
      value: num,
      color: color,
      type: "normal"
    }));

    const actionCards = specialActionCards.map((type) => ({
      id: `${color}-${type}`,
      value: type,
      color: color,
      type: "normal"
    }));

    return [...numeric, ...actionCards];
  });

  return (
    <div className="game-board-container">
      <header className="game-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          ← Salir
        </button>
        <h1>Mesa de Juego</h1>
      </header>
      
      <div className="board-main-area">
        <div className="deck-display-grid">
          {fullDeck.map((card) => (
            <div key={card.id} className="card-preview-wrapper">
              <Card 
                value={card.value} 
                color={card.color} 
                type={card.type} 
              />
            </div>
          ))}
        </div>
      </div>

      <footer className="player-hand-container">
        <p>Mostrando {fullDeck.length} cartas (Numéricas + Especiales por color)</p>
      </footer>
    </div>
  );
}