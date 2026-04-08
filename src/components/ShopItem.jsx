import React from "react";
import "../styles/ShopItem.css";

const ShopItem = ({ item, onBuy }) => {
  const renderIcon = () => {
    const iconValue = item.icon || "👤";
    const isImage = iconValue.includes(".") || iconValue.startsWith("/");

    if (isImage) {
      return (
        <img 
          src={iconValue.startsWith("/") ? iconValue : `/img/${iconValue}`} 
          alt={item.name} 
          className="shop-item-asset" 
        />
      );
    }

    return <span className="shop-item-emoji">{iconValue}</span>;
  };

  return (
    <div className="shop-item-card">
      <div className="item-icon-display">
        {renderIcon()}
      </div>
      <div className="item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">💰 {item.price}</span>
      </div>
      
      {item.owned ? (
        <button className="btn-buy btn-owned" disabled>
          Adquirido
        </button>
      ) : (
        <button className="btn-buy" onClick={() => onBuy(item)}>
          Comprar
        </button>
      )}
    </div>
  );
};

export default ShopItem;