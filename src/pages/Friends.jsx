import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendsFilter from "../components/FriendsFilter";
import FriendItem from "../components/FriendsItem"; 
import ConfirmModal from "../components/ConfirmModal";
import SearchBar from "../components/SearchBox"; 
import "../styles/Friends.css";

const Friends = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("Mis Amigos (1)");
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalMode, setModalMode] = useState("delete");
  const [searchQuery, setSearchQuery] = useState(""); 

  const friendsList = [
    { id: 1, name: "JuanCarlos", coins: 1250, icon: "👩", status: "En línea" },
    { id: 2, name: "MariaLopez", coins: 890, icon: "🧔", status: "Offline" }
  ];

  const suggestedUsers = [
    { id: 3, name: "Jugador 3", coins: 300, icon: "😎", status: "" },
    { id: 4, name: "Jugador 4", coins: 150, icon: "🎯", status: "" },
    { id: 5, name: "Carlos99", coins: 500, icon: "🔥", status: "" },
  ];

  const filteredUsers = suggestedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteOpen = (friend) => {
    setModalMode("delete");
    setSelectedFriend(friend);
    setShowModal(true);
  };

  const handleAddOpen = (user) => {
    setModalMode("add");
    setSelectedFriend(user);
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log(modalMode === "delete" ? "Eliminando a:" : "Invitando a:", selectedFriend.name);
    setShowModal(false);
  };

  return (
    <div className="home-screen">
      <div className="main-card-profile-layout friends-container">
        <header className="profile-header">
          <div className="friends-title-section">
            <span className="friends-main-icon">👥</span>
            <h1>Amigos</h1>
          </div>
          <div className="friends-header-actions">
            <button className="btn-back-friends" onClick={() => navigate("/")}>
              <span className="back-icon">↩</span> Volver
            </button>
          </div>
        </header>

        <FriendsFilter activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="friends-content-list">
          
          {activeTab.includes("Mis Amigos") && 
            friendsList.map(friend => (
              <FriendItem key={friend.id} friend={friend} onDelete={handleDeleteOpen} />
            ))
          }

          {activeTab === "Buscar Amigos" && (
            <div className="search-friends-section">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              <div className="search-results-list">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <FriendItem 
                      key={user.id} 
                      friend={user} 
                      isSearchMode={true} 
                      onAdd={handleAddOpen}
                    />
                  ))
                ) : (
                  <p className="no-results-text">No se encontraron jugadores.</p>
                )}
              </div>
            </div>
          )}

          {activeTab.includes("Solicitudes") && (
            <div className="placeholder-container">
              <span className="empty-icon">✉️</span>
              <p className="placeholder-text">No hay solicitudes pendientes.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedFriend && (
        <ConfirmModal 
          type={modalMode === "add" ? "success" : "danger"} 
          message={
            modalMode === "add" 
              ? `¿Quieres enviar una solicitud a "${selectedFriend.name}"?`
              : `¿Seguro que desea eliminar a "${selectedFriend.name}"?`
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Friends;