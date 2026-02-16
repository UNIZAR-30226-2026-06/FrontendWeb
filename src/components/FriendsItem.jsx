import React from "react";
import "../styles/FriendsItem.css";

const FriendItem = ({ friend, onDelete, onAdd, isSearchMode = false }) => {
  const isOnline = friend.status === "En línea";
  const statusColor = isOnline ? "#2ecc71" : "#95a5a6";

  return (
    <div className="friend-item-row">
      <div className="friend-info-group">
        <div className="avatar-container">
          <span className="avatar-emoji">{friend.icon}</span>
          {!isSearchMode && (
            <span 
              className="status-dot-overlay" 
              style={{ backgroundColor: statusColor }}
            ></span>
          )}
        </div>
        
        <div className="friend-text-column">
          <span className="friend-name-top">{friend.name}</span>
          <div className="friend-details-bottom">
            {isSearchMode ? (
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

      {isSearchMode ? (
        <button className="btn-add-friend" onClick={() => onAdd(friend)}>
          <span className="add-icon">👤+</span> Agregar
        </button>
      ) : (
        <button className="btn-delete-small" onClick={() => onDelete(friend)}>
          <span className="delete-icon">👤❌</span> Eliminar
        </button>
      )}
    </div>
  );
};

export default FriendItem;