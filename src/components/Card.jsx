import React from "react";
import "../styles/Card.css";

const Card = ({ value, color, type = "normal" }) => {
  return (
    <div className={`card-visual-container ${color} ${type}`}>
      <span className="card-corner-value top-left">{value}</span>
      
      <div className="card-center-circle">
        <span className="card-main-value">{value}</span>
      </div>
      
      <span className="card-corner-value bottom-right">{value}</span>
    </div>
  );
};

export default Card;