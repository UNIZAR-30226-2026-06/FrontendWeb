import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomeNavigation.css";

const HomeNavigation = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Amigos", icon: "👥", path: "/friends" },
    { label: "Tienda", icon: "🏪", path: "/shop" },
    { label: "Perfil", icon: "👤", path: "/profile" },
  ];

  return (
    <footer className="bottom-nav">
      {navItems.map((item, index) => (
        <button 
          key={index} 
          className="nav-item" 
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span> 
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </footer>
  );
};

export default HomeNavigation;