import React from "react";
import "../styles/ShopItem.css";
const ShopItem = ({ item, onBuy }) => {
  return (
    <div className="shop-item-card">
      <div className="item-icon-display">{item.icon}</div>
      <div className="item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">💰 {item.price}</span>
      </div>
      <button className="btn-buy" onClick={() => onBuy(item)}>
        Comprar
      </button>
    </div>
  );
};

export default ShopItem;