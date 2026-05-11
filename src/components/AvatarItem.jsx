import React from "react";
import { motion } from "framer-motion";
import "../styles/AvatarItem.css";

const AvatarItem = ({ icon, isActive, onClick, index = 0 }) => {
  const isImage = icon?.includes(".") || icon?.startsWith("/");

  return (
    <motion.button className={`avatar-item ${isActive ? "active" : ""}`} onClick={onClick} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 20 }} whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.92 }} style={{ position: "relative" }}>
      {isImage ? <img src={icon} alt="Avatar" className="avatar-img-item" /> : <span className="avatar-emoji-item">{icon}</span>}

      {isActive && (
        <motion.span
          style={{ position: "absolute", inset: -3, borderRadius: "inherit", border: "2px solid currentColor", pointerEvents: "none" }}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};

export default AvatarItem;