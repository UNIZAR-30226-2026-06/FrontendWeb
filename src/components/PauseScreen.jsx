import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/PauseScreen.css";

const PauseScreen = ({ gameId, pauseVotes = 0, totalVotes = 0, onRequestResume, onGoHome }) => {
  const navigate = useNavigate();
  const goHome = onGoHome || (() => navigate("/home"));

  return (
    <motion.div
      className="ps-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ps-particles" aria-hidden>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="ps-particle"
            style={{ left: `${10 + i * 11}%` }}
            animate={{ y: [0, -24, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div
        className="ps-panel"
        initial={{ scale: 0.75, y: 50, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={{    scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
      >
        <motion.div
          className="ps-icon"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ⏸️
        </motion.div>

        <h1 className="ps-title">Partida Pausada</h1>
        <p className="ps-subtitle">La partida ha sido pausada por consenso</p>

        {pauseVotes > 0 && (
          <motion.div
            className="ps-votes-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="ps-votes-label">Votos para reanudar</span>
            <div className="ps-votes-count">
              {[...Array(totalVotes)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`ps-vote-dot ${i < pauseVotes ? "filled" : ""}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                />
              ))}
            </div>
            <span className="ps-votes-hint">{pauseVotes}/{totalVotes} jugadores listos</span>
          </motion.div>
        )}

        <div className="ps-actions">
          <motion.button
            className="ps-btn ps-btn-resume"
            onClick={onRequestResume}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(98,177,85,0)",
                "0 0 24px rgba(98,177,85,0.55)",
                "0 0 0px rgba(98,177,85,0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ▶ Quiero reanudar
          </motion.button>

          <motion.button
            className="ps-btn ps-btn-home"
            onClick={goHome}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🏠 Volver al inicio
          </motion.button>
        </div>

        <p className="ps-hint">
          Se necesitan todos los jugadores para reanudar
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PauseScreen;