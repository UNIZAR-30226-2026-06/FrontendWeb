import React from "react";
import { motion } from "framer-motion";
import "../styles/HandSideButtons.css";

const HandSideButtons = ({
  onChatClick,
  onRoleClick,
  unreadCount = 0,
  showRoleButton = false,
  roleCanUse = false,
}) => {
  return (
    <div className="hand-side-buttons">
      {showRoleButton && (
        <motion.button
          className={`hsb-btn hsb-role ${roleCanUse ? "hsb-pulse" : ""}`}
          onClick={onRoleClick}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          title="Ver / usar mi rol"
          aria-label="Ver mi rol"
          animate={
            roleCanUse
              ? {
                  boxShadow: [
                    "0 0 0px rgba(0,229,255,0)",
                    "0 0 18px rgba(0,229,255,0.55)",
                    "0 0 0px rgba(0,229,255,0)",
                  ],
                }
              : {}
          }
          transition={
            roleCanUse ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}
          }
        >
          <span className="hsb-icon">🎭</span>
        </motion.button>
      )}

      <motion.button
        className="hsb-btn hsb-chat"
        onClick={onChatClick}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        title="Abrir chat"
        aria-label="Abrir chat"
      >
        <span className="hsb-icon">💬</span>
        {unreadCount > 0 && (
          <motion.span
            className="hsb-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={unreadCount}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default HandSideButtons;