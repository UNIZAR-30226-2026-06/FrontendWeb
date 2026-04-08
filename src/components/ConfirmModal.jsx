import React from "react";
import "../styles/ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel, type = "danger", confirmLabel }) => {
  const defaultConfirmText = type === "success" ? "Enviar Solicitud" : "Eliminar";
  
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type === "success" ? "modal-success" : "modal-danger"}`}>
        <div className="modal-icon">
          {type === "success" ? "📩" : "⚠️"}
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn-modal cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className={`btn-modal confirm ${type}`} onClick={onConfirm}>
            {confirmLabel || defaultConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;