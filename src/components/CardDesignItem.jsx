import React from "react";
import "../styles/CardDesignItem.css"; 

const CardDesignItem = ({ title, icon, isActive, onClick }) => {
  const renderIcon = () => {
    const iconValue = icon || "🃏";
    const isImage = iconValue.includes(".") || iconValue.startsWith("/");

    if (isImage) {
      return (
        <img 
          src={iconValue.startsWith("/") ? iconValue : `/img/${iconValue}`} 
          alt={title} 
          className="design-img" 
        />
      );
    }

    return <span className="design-emoji">{iconValue}</span>;
  };

  return (
    <button 
      className={`card-design-btn ${isActive ? "active" : ""}`} 
      onClick={onClick}
      title={title} 
    >
      <div className="design-icon-wrapper">
        {renderIcon()}
      </div> 
    </button>
  );
};

export default CardDesignItem;