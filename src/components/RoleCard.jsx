import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/RoleCard.css";

const RoleCard = ({ role, isRevealed = false }) => {
  const wasRevealed = useRef(false);
  const [flipped, setFlipped] = useState(false);
  const [showContent, setShowContent] = useState(isRevealed);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (isRevealed && !wasRevealed.current) {
      wasRevealed.current = true;
      setFlipped(false);
      setTimeout(() => setShowContent(true), 350);
      setTimeout(() => {
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 900);
      }, 700);
    }
  }, [isRevealed]);

  if (!role) {
    return (
      <div className="role-card-container">
        <div className="role-card-placeholder">
          <span className="placeholder-icon">❓</span>
          <p>Sin rol</p>
        </div>
      </div>
    );
  }

  const roleName = role.role?.name || "Rol";
  const roleDescription = role.role?.description || "Sin descripción";
  const roleImage = role.role?.icon;
  const maxUses = role?.maxUses ?? 0;
  const uses = role?.uses ?? 0;
  const remainingUses = maxUses > 0 ? Math.max(maxUses - uses, 0) : 0;
  const canUseNow = role?.canUseNow ?? false;

  return (
    <div className="role-card-container">
      <AnimatePresence>
        {showBurst && (
          <motion.div
            className="role-reveal-burst"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5,  opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="role-card-flipper"
        animate={{ rotateY: showContent ? 0 : 180 }}
        initial={{ rotateY: isRevealed ? 0 : 180 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="role-card role-face-front">
          <div className="role-card-inner">
            <div className="role-icon-large">
              {roleImage ? (
                <img
                  src={`/assets/roles/${roleImage}`}
                  alt={roleName}
                  onError={(e) => e.currentTarget.remove()}
                />
              ) : (
                <motion.span
                  animate={showBurst ? { scale: [1, 1.4, 1], filter: ["drop-shadow(0 0 0px #00e5ff)", "drop-shadow(0 0 20px #00e5ff)", "drop-shadow(0 0 6px #00e5ff)"] } : {}}
                  transition={{ duration: 0.7 }}
                >
                  🎭
                </motion.span>
              )}
            </div>
            <h3 className="role-name">{roleName}</h3>
            <p className="role-description">{roleDescription}</p>
            <div className="role-stats">
              <div className="stat-item">
                <span className="stat-label">Usos</span>
                <span className="stat-value">{remainingUses}/{maxUses}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-label">Estado</span>
                <span className={`stat-value ${canUseNow ? "available" : "unavailable"}`}>
                  {canUseNow ? "Listo" : "Espera"}
                </span>
              </div>
            </div>

          </div>
        </div>
        <div className="role-card role-face-back">
          <div className="role-back-inner">
            <span>🎭</span>
            <span className="role-back-text">ROL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleCard;