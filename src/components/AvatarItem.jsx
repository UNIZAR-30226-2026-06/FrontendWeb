import React from "react";
import "../styles/AvatarItem.css"; 

const AvatarItem = ({ icon, isActive, onClick }) => {
  const isImage = icon?.includes('.') || icon?.startsWith('/');

  return (
    <button className={`avatar-item ${isActive ? "active" : ""}`} onClick={onClick}>
      {isImage ? (
        <img src={icon} alt="Avatar" className="avatar-img-item" />
      ) : (
        <span className="avatar-emoji-item">{icon}</span>
      )}
    </button>
  );
};

export default AvatarItem;