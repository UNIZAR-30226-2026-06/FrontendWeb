import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/PauseVoteBanner.css";

const PauseVoteBanner = ({ requestedBy, onVoteYes, onVoteNo, onDismiss, autoCloseMs = 15000 }) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseMs / 1000);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDismiss?.();
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const progress = (timeLeft / (autoCloseMs / 1000)) * 100;

  return (
    <motion.div
      className="pvb-wrapper"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{    y: -80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div className="pvb-icon">⏸️</div>
      <div className="pvb-content">
        <p className="pvb-title">
          <span className="pvb-player">{requestedBy}</span> quiere pausar la partida
        </p>
        <div className="pvb-timer-bar">
          <motion.div
            className="pvb-timer-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>
        <p className="pvb-hint">Se ignora automáticamente en {timeLeft}s</p>
      </div>
      <div className="pvb-actions">
        <motion.button
          className="pvb-btn pvb-yes"
          onClick={onVoteYes}
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}
        >✓ Pausar</motion.button>
        <motion.button
          className="pvb-btn pvb-no"
          onClick={onVoteNo}
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}
        >✕ Rechazar</motion.button>
      </div>
    </motion.div>
  );
};

export default PauseVoteBanner;