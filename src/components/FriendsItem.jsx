import React from "react";
import "../styles/FriendsItem.css";

const FriendItem = ({ friend, onDelete, onAdd, onAccept, onReject, isSearchMode = false, isRequestMode = false }) => {
  const isOnline = friend.status === "En línea";
  const statusColor = isOnline ? "#2ecc71" : "#95a5a6";

  return (
    <div className="friend-item-row">
      <div className="friend-info-group">
        <div className="avatar-container">
          <span className="avatar-emoji">{friend.icon}</span>
          {!isSearchMode && !isRequestMode && (
            <span className="status-dot-overlay" style={{ backgroundColor: statusColor }}></span>
          )}
        </div>
        
        <div className="friend-text-column">
          <span className="friend-name-top">{friend.name || "Sin nombre"}</span>
          <div className="friend-details-bottom">
            {isSearchMode || isRequestMode ? (
              <span className="coins-text">{friend.coins} monedas</span>
            ) : (
              <>
                <span className="status-text">{friend.status}</span>
                <span className="separator-dot">•</span>
                <span className="coins-text">{friend.coins} monedas</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="friend-actions">
        {isSearchMode && (
          <button className="btn-add-friend" onClick={() => onAdd(friend)}>
            <span className="add-icon">👤+</span> Agregar
          </button>
        )}

        {isRequestMode && (
          <div className="request-actions-btns">
            <button className="btn-add-friend" onClick={() => onAccept(friend)}>
              <span className="add-icon">👤+</span> Agregar
            </button>
            <button className="btn-delete-small" onClick={() => onReject(friend)}>
              <span className="delete-icon">👤❌</span> Eliminar
            </button>
          </div>
        )}

        {!isSearchMode && !isRequestMode && (
          <button className="btn-delete-small" onClick={() => onDelete(friend)}>
            <span className="delete-icon">👤❌</span> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendItem;