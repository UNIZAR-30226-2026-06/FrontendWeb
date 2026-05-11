import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ShopItem.css";

const ShopItem = ({ item, onBuy }) => {
  const [justBought, setJustBought] = useState(false);

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

  const handleBuy = () => {
    setJustBought(true);
    onBuy(item);
    setTimeout(() => setJustBought(false), 1500);
  };

  return (
    <motion.div
      className="shop-item-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="item-icon-display"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
      >
        {renderIcon()}
      </motion.div>

      <div className="item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">💰 {item.price}</span>
      </div>

      {item.owned ? (
        <motion.button
          className="btn-buy btn-owned"
          disabled
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Adquirido
        </motion.button>
      ) : (
        <AnimatePresence mode="wait">
          {justBought ? (
            <motion.button
              key="bought"
              className="btn-buy btn-owned"
              disabled
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ✅ Comprando...
            </motion.button>
          ) : (
            <motion.button
              key="buy"
              className="btn-buy"
              onClick={handleBuy}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
            >
              Comprar
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ShopItem;