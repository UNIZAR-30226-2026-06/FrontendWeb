import React from "react";
import "../styles/GameBoard.css";
import Card from "./Card"; 

const GameBoard = ({ myCards, currentTableCard, cardStyle = "basic" }) => {
  
  const RenderOpponent = ({ name, cards, pos, cardStyle = 'retro', emoji = "🤖" }) => {
    return (
      <div className={`opponent-container ${pos}`}>
        <div className="avatar-capsule">
          <div className="avatar-glow">{emoji}</div>
          <div className="avatar-tag">
            <span className="bot-name">{name}</span>
            <span className="card-count-badge">{cards}</span>
          </div>
        </div>
        
        <div className={`bot-cards-fan fan-${pos}`}>
          {[...Array(cards)].map((_, i) => {
            const mid = (cards - 1) / 2;
            const rotateDegree = (i - mid) * 12; 
            
            return (
              <div 
                key={i} 
                className={`card-back-${cardStyle} bot-card-item`}
                style={{
                  zIndex: i,
                  transform: `rotate(${rotateDegree}deg)`,
                  marginLeft: i === 0 ? '0' : '-35px' 
                }}
              >
                <div className="back-inner">
                  {cardStyle === 'retro' ? 'UNO' : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`game-board-layout style-${cardStyle}`}>
      <RenderOpponent name="Bot 14" cards={4} pos="left" />
      <RenderOpponent name="Bot 24" cards={4} pos="top" />
      <RenderOpponent name="Bot 33" cards={4} pos="right" />

      <div className="board-center">
        <div className="draw-pile">
           <div className={`card-back-${cardStyle} draw-stack`}>
              <div className="back-inner">UNO</div>
           </div>
        </div>
        
        <div className="active-card-area">
          {currentTableCard && (
            <Card 
              value={currentTableCard.value} 
              color={currentTableCard.color} 
              style={cardStyle} 
            />
          )}
        </div>
      </div>

      <div className="player-interaction-area">
        <div className="my-hand-container">
          {myCards.map((card, index) => (
            <div key={index} className="card-hover-wrapper">
              <Card 
                value={card.value} 
                color={card.color} 
                style={cardStyle} 
              />
            </div>
          ))}
        </div>
        
        <button className={`uno-shout-btn ${cardStyle}`}>UNO</button>
      </div>
    </div>
  );
};

export default GameBoard;