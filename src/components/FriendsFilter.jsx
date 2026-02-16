import React from "react";
import "../styles/FriendsFilter.css";

const FriendsFilter = ({ activeTab, setActiveTab }) => {
  const tabs = ["Mis Amigos (1)", "Buscar Amigos", "Solicitudes (1)"];

  return (
    <div className="friends-filter-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`filter-btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FriendsFilter;