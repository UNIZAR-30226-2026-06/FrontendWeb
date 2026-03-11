import React from "react";
import "../styles/GameBoard.css";

const GameBoard = ({ myCards, currentTableCard }) => {
  const RenderOpponent = ({ name, cards, pos, emoji = "🤖" }) => (
    <div className={`opponent-container ${pos}`}>
      <div className="avatar-capsule">
        <div className="avatar-glow">{emoji}</div>
        <div className="avatar-tag">
          <span className="bot-name">{name}</span>
          <span className="card-count-badge">{cards}</span>
        </div>
      </div>
      <div className="bot-cards-fan">
        {[...Array(cards)].map((_, i) => (
          <div key={i} className="card-back-cosmic">
            <span className="moon-symbol">🌙</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="game-board-layout">
      <RenderOpponent name="Bot 14" cards={4} pos="left" />
      <RenderOpponent name="Bot 24" cards={4} pos="top" />
      <RenderOpponent name="Bot 33" cards={4} pos="right" />

      <div className="board-center">
        <div className="draw-pile">
          <span className="moon-symbol">🌙</span>
        </div>
        
        {currentTableCard && (
          <div className={`active-card card-${currentTableCard.color}`}>
            <div className="card-inner">
              <span className="card-value">{currentTableCard.value}</span>
            </div>
          </div>
        )}
      </div>

      <div className="player-interaction-area">
        <div className="my-hand-container">
          {myCards.map((card, index) => (
            <div key={index} className="card-wrapper">
              <div className={`game-card card-${card.color}`}>
                <div className="card-inner">
                  <span className="card-value">{card.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="uno-shout-btn">UNO</button>
      </div>
    </div>
  );
};

export default GameBoard;