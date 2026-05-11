import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/PauseScreen.css";

const ResumeWaitingScreen = ({
  hasVoted = false,
  onVote,
  resumeVotes = 0,
  totalNeeded = 0,
  voters = [],
  onGoHome,
}) => {
  const navigate = useNavigate();
  const goHome = onGoHome || (() => navigate("/home"));
  const progress = totalNeeded > 0 ? (resumeVotes / totalNeeded) * 100 : 0;

  return (
    <motion.div
      className="ps-backdrop rsw-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="ps-panel"
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1,   y: 0,  opacity: 1 }}
        exit={{    scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
      >

        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="pre-vote"
              className="rsw-pre-vote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="ps-icon"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ⏸️
              </motion.div>

              <h1 className="ps-title">Partida Pausada</h1>
              <p className="ps-subtitle">
                {resumeVotes > 0
                  ? `${resumeVotes} jugador${resumeVotes > 1 ? "es" : ""} ya quier${resumeVotes > 1 ? "en" : "e"} reanudar`
                  : "¿Listo para continuar la partida?"}
              </p>

              {voters.length > 0 && (
                <div className="rsw-voters">
                  {voters.map((v, i) => (
                    <motion.span
                      key={i}
                      className="rsw-voter-chip"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      ✓ {v}
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="ps-actions" style={{ marginTop: "8px" }}>
                <motion.button
                  className="ps-btn ps-btn-resume"
                  onClick={onVote}
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  🏠 Volver al inicio
                </motion.button>
              </div>

              <p className="ps-hint">
                Se necesitan {totalNeeded} votos para reanudar
              </p>
            </motion.div>

          ) : (
            <motion.div
              key="post-vote"
              className="rsw-pre-vote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="rsw-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.div>

              <h1 className="ps-title">Esperando jugadores</h1>
              <p className="ps-subtitle">
                {resumeVotes} de {totalNeeded} jugador{totalNeeded > 1 ? "es" : ""} listos
              </p>

              <div className="rsw-progress-track">
                <motion.div
                  className="rsw-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>

              <div className="ps-votes-count rsw-dots">
                {[...Array(totalNeeded)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`ps-vote-dot ${i < resumeVotes ? "filled" : ""}`}
                    animate={i < resumeVotes ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>

              {voters.length > 0 && (
                <div className="rsw-voters">
                  {voters.map((v, i) => (
                    <motion.span
                      key={i}
                      className="rsw-voter-chip"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ✓ {v}
                    </motion.span>
                  ))}
                </div>
              )}

              <motion.button
                className="ps-btn ps-btn-home"
                style={{ marginTop: "8px" }}
                onClick={goHome}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                🏠 Volver al inicio
              </motion.button>

              <p className="ps-hint">La partida se reanudará automáticamente cuando todos estén listos</p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
};

export default ResumeWaitingScreen;