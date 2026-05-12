import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoleCard from "./RoleCard";
import RoleActionPanel from "./RoleActionPanel";
import "../styles/RoleOverlay.css";

const RoleOverlay = ({
  open,
  onClose,
  role,
  isRevealed,
  gameId,
  isPlayerTurn,
  players,
  myCards,
  onRoleUsed,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="role-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="role-overlay-content"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="role-overlay-close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <RoleCard role={role} isRevealed={isRevealed} />
            <RoleActionPanel
              role={role}
              gameId={gameId}
              isPlayerTurn={isPlayerTurn}
              players={players}
              myCards={myCards}
              onRoleUsed={onRoleUsed}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleOverlay;