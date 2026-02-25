import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/HomeNavigation.css";

const HomeNavigation = () => {
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState("👤");

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  const navItems = [
    { label: "Amigos", icon: "👥", path: "/friends" },
    { label: "Tienda", icon: "🏪", path: "/shop" },
    { label: "Perfil", icon: userAvatar, path: "/profile" },
  ];

  const handleNavigation = (path) => {
    playSound('slide'); 
    navigate(path);
  };

  return (
    <footer className="bottom-nav">
      {navItems.map((item, index) => (
        <button 
          key={index} 
          className="nav-item" 
          onClick={() => handleNavigation(item.path)}
        >
          <span className="nav-icon">{item.icon}</span> 
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </footer>
  );
};

export default HomeNavigation;