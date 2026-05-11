import React, { useState, useEffect } from "react";
import { getAvatarById } from "../services/userService";
import "../styles/FriendsItem.css";

const FriendItem = ({ friend, onDelete, onAdd, onAccept, onReject, isSearchMode = false, isRequestMode = false }) => {
  const [avatarEmoji, setAvatarEmoji] = useState(null);
  const isOnline = friend.status === "Online";
  const statusColor = isOnline ? "#2ecc71" : "#95a5a6";

  useEffect(() => {
    const fetchAvatarData = async () => {
      if (friend.avatarId && !isNaN(friend.avatarId)) {
        try {
          const data = await getAvatarById(friend.avatarId);
          if (data && data.length > 0 && data[0].image) {
            setAvatarEmoji(data[0].image);
          }
        } catch (error) {
          console.error(`Error al cargar avatar ${friend.avatarId}:`, error);
        }
      }
    };
    fetchAvatarData();
  }, [friend.avatarId]);

  return (
    <div className="friend-item-row">
      <div className="friend-info-group">
        <div className="avatar-container">
          <span className="avatar-emoji">
            {avatarEmoji || friend.icon || "👤"}
          </span>
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
                <span className="status-text" style={{ color: statusColor, fontWeight: isOnline ? "bold" : "normal" }}>
                  {friend.status}
                </span>
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
              <span className="delete-icon">👤❌</span> Rechazar
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