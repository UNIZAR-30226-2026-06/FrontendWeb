import React from "react";
import "../styles/FriendsFilter.css";

const FriendsFilter = ({ activeTab, setActiveTab, count, pendingCount }) => {
  const tabs = [
    { id: "Mis Amigos", label: `Mis Amigos (${count})` },
    { id: "Buscar Amigos", label: "Buscar Amigos" },
    { id: "Solicitudes", label: `Solicitudes (${pendingCount || 0})` } 
  ];

  return (
    <div className="friends-filter-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`filter-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FriendsFilter;