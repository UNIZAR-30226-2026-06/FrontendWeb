import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ColorPicker.css";

const COLORS = [
  { id: "red", label: "Rojo", hex: "#D72600" },
  { id: "green", label: "Verde", hex: "#379711" },
  { id: "blue", label: "Azul", hex: "#0956BF" },
  { id: "yellow", label: "Amarillo", hex: "#ECD407" },
];

const ColorPicker = ({ title = "Elige un color", description = "El siguiente jugador deberá jugar este color", mode = "choose", onSelect, onCancel }) => {
  const isCancelMode = mode === "cancel";

  return (
    <AnimatePresence>
      <motion.div className="color-picker-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
        <motion.div className={`color-picker-card ${isCancelMode ? "cancel-mode" : ""}`} initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.7, y: 30 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} onClick={(e) => e.stopPropagation()}>
          <h2 className="color-picker-title">{title}</h2>
          <p className="color-picker-desc">{description}</p>

          <div className="color-picker-grid">
            {COLORS.map((c) => (
              <motion.button key={c.id} className={`color-picker-btn ${isCancelMode ? "cancel" : ""}`} style={{ background: c.hex }} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }} onClick={() => onSelect && onSelect(c.id)} aria-label={c.label}>
                {isCancelMode && <svg viewBox="0 0 100 100" className="cancel-mark" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="#fff" strokeWidth="6" /><line x1="22" y1="22" x2="78" y2="78" stroke="#fff" strokeWidth="9" strokeLinecap="round" /></svg>}
                <span className="color-picker-label">{c.label}</span>
              </motion.button>
            ))}
          </div>

          <button className="color-picker-back" onClick={onCancel}>
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorPicker;