import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel, type = "danger", confirmLabel, icon }) => {
  const defaultConfirmText = type === "success" ? "Enviar Solicitud" : "Eliminar";
  const defaultIcon = type === "success" ? "📩" : "⚠️";
  const displayIcon = icon ?? defaultIcon;

  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onCancel}>
        <motion.div className={`modal-content ${type === "success" ? "modal-success" : "modal-danger"}`} initial={{ opacity: 0, y: 60, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} onClick={(e) => e.stopPropagation()}>
          <motion.div className="modal-icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}>
            {displayIcon}
          </motion.div>

          <motion.p className="modal-message" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.25 }}>
            {message}
          </motion.p>

          <motion.div className="modal-actions" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}>
            {[
              { label: "Cancelar", className: "btn-modal cancel", onClick: onCancel },
              { label: confirmLabel || defaultConfirmText, className: `btn-modal confirm ${type}`, onClick: onConfirm },
            ].map(({ label, className, onClick }) => (
              <motion.button key={label} className={className} onClick={onClick} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;