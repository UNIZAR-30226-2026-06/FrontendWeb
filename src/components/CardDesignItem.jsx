// src/components/CardDesignItem.jsx
import React from "react";
import "../styles/CardDesignItem.css"; 

const CardDesignItem = ({ title, icon, isActive, onClick }) => {
  return (
    <button 
      className={`card-design-btn ${isActive ? "active" : ""}`} 
      onClick={onClick}
    >
      <span className="design-icon">{icon}</span> {title}
    </button>
  );
};

export default CardDesignItem;