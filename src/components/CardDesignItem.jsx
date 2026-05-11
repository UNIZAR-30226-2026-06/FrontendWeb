import React from "react";
import { motion } from "framer-motion";
import "../styles/CardDesignItem.css";

const CardDesignItem = ({ title, icon, isActive, onClick, index = 0 }) => {
  const renderIcon = () => {
    const iconValue = icon || "🃏";
    const isImage = iconValue.includes(".") || iconValue.startsWith("/");

    if (isImage) {
      return (
        <img src={iconValue.startsWith("/") ? iconValue : `/img/${iconValue}`} alt={title} className="design-img" />
      );
    }
    return <span className="design-emoji">{iconValue}</span>;
  };

  return (
    <motion.button className={`card-design-btn ${isActive ? "active" : ""}`} onClick={onClick} title={title} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 20 }} whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.92 }} style={{ position: "relative" }}>
      <div className="design-icon-wrapper">
        {renderIcon()}
      </div>

      {isActive && <motion.span style={{ position: "absolute", inset: -3, borderRadius: "inherit", border: "2px solid currentColor", pointerEvents: "none" }} animate={{ opacity: [1, 0.4, 1], scale: [1, 1.06, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />}
    </motion.button>
  );
};

export default CardDesignItem;