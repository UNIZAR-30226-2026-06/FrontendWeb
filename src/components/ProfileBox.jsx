// src/components/ProfileBox.jsx
import React from "react";
import "../styles/ProfileBox.css"; 

const ProfileBox = ({ title, value, icon, children, className = "" }) => {
  return (
    <div className={`profile-box ${className}`}>
      {icon && <span className="box-icon">{icon}</span>}
      {title && <p className="box-title">{title}</p>}
      {value !== undefined && <strong className="box-value">{value}</strong>}
      {children}
    </div>
  );
};

export default ProfileBox;