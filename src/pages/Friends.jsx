import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FriendsFilter from "../components/FriendsFilter";
import FriendItem from "../components/FriendsItem"; 
import ConfirmModal from "../components/ConfirmModal";
import SearchBar from "../components/SearchBox"; 
import { useSocket } from "../context/SocketContext";
import "../styles/Friends.css";

import { getMyFriends, searchUsers, deleteFriend, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getConnectedFriends } from "../services/userService";
import { getCheckMe } from "../services/authService";

const Friends = () => {
  const navigate = useNavigate();
  const { pendingRequests, setPendingRequests, sendNewFriendRequest, sendFriendRequestAccepted, sendFriendRequestRejected } = useSocket();
  
  const [friendsList, setFriendsList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Mis Amigos");
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalMode, setModalMode] = useState("delete");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [friendsData, meData, connectedData] = await Promise.all([ getMyFriends(), getCheckMe(), getConnectedFriends() ]);

        setCurrentUser(meData);

        const connectedIds = Array.isArray(connectedData) 
          ? connectedData.map(c => typeof c === 'object' ? c.id : c)
          : [];

        const mappedFriends = friendsData.map(f => {
          const isObj = typeof f === 'object' && f !== null;
          const name = isObj ? (f.nombre_usuario || f.name) : f;
          const id = isObj ? (f.id || name) : name;
          const isOnline = connectedIds.includes(id);
          const coins = isObj ? (f.monedas ?? f.coins ?? 0) : 0;
          const avatarIcon = isObj ? (f.image || "👤") : "👤";

          return { id, name, coins, icon: avatarIcon, status: isOnline ? "Online" : "Offline" };
        });
        
        setFriendsList(mappedFriends);
      } catch (error) {
        if (!error.message?.includes("401")) toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (activeTab !== "Buscar Amigos" || trimmedQuery === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await searchUsers(trimmedQuery);
        const mapped = data
          .map(res => ({
            id: res.id || res,
            name: res.nombre_usuario || res,
            coins: res.monedas || 0,
            icon: res.image || "👤",
            status: ""
          }))
          .filter(user => 
            user.name !== currentUser?.nombre_usuario && 
            !friendsList.some(f => f.name === user.name)
          );
        setSearchResults(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab, currentUser, friendsList]);

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

  const handleAcceptRequest = async (user) => {
    try {
      await acceptFriendRequest(user.id);
      setPendingRequests(prev => prev.filter(r => r.id !== user.id));
      const newFriend = { ...user, status: "Offline" };
      setFriendsList(prev => [...prev, newFriend]);
      sendFriendRequestAccepted(user.id);
      toast.success(`¡Ahora eres amigo de ${user.name}!`);
    } catch (error) {
      toast.error("No se pudo aceptar la solicitud");
    }
  };

  const handleRejectRequest = async (user) => {
    try {
      await rejectFriendRequest(user.id);
      setPendingRequests(prev => prev.filter(r => r.id !== user.id));
      sendFriendRequestRejected(user.id);
      toast.error("Solicitud rechazada");
    } catch (error) {
      toast.error("Error al rechazar la solicitud");
    }
  };

  const handleConfirm = async () => {
    if (modalMode === "add") {
      try {
        await sendFriendRequest(selectedFriend.id);
        sendNewFriendRequest(selectedFriend.id);

        setSearchResults(prev => prev.filter(u => u.id !== selectedFriend.id));
        toast.success("Solicitud enviada", { 
          description: `Invitación enviada a ${selectedFriend.name}.`, 
          icon: "📩" 
        });
      } catch (error) {
        toast.error("Error al enviar solicitud");
      }
    } else {
      try {
        await deleteFriend(selectedFriend.id);
        setFriendsList(prev => prev.filter(f => f.id !== selectedFriend.id));
        toast.error("Amigo eliminado", { 
          description: `${selectedFriend.name} eliminado.`, 
          icon: "🗑️" 
        });
      } catch (error) {
        toast.error("No se pudo eliminar al amigo");
      }
    }
    setShowModal(false);
  };

  return (
    <div className="home-screen">
      <div className="main-card-profile-layout friends-container">
        <header className="profile-header">
          <div className="friends-title-section">
            <span className="friends-main-icon">👥</span>
            <h1>{activeTab === "Solicitudes" ? "Solicitudes" : "Amigos"}</h1>
          </div>
          <div className="friends-header-actions">
            <button className="btn-back-friends" onClick={() => navigate(-1)}>
              <span className="back-icon">↩</span> Volver
            </button>
          </div>
        </header>

        <FriendsFilter 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          count={friendsList.length}
          pendingCount={pendingRequests.length} 
        />

        <div className="friends-content-list">
          {activeTab === "Mis Amigos" && (
            loading ? (
              <p className="placeholder-text">Cargando tus amigos...</p>
            ) : friendsList.length > 0 ? (
              friendsList.map(friend => <FriendItem key={friend.id} friend={friend} onDelete={handleDeleteOpen} />)
            ) : (
              <div className="placeholder-container">
                <span className="empty-icon">🏜️</span>
                <p className="placeholder-text">Aún no tienes amigos agregados.</p>
              </div>
            )
          )}

          {activeTab === "Buscar Amigos" && (
            <div className="search-friends-section">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <div className="search-results-list">
                {isSearching ? (
                  <p className="placeholder-text">Buscando usuarios...</p>
                ) : (
                  <>
                    {searchQuery.trim() === "" && <p className="search-hint">Escribe para buscar nuevos amigos...</p>}
                    {searchResults.map(user => (
                      <FriendItem key={user.id} friend={user} isSearchMode={true} onAdd={handleAddOpen} />
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "Solicitudes" && (
            <div className="requests-list">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(req => (
                  <FriendItem 
                    key={req.id} 
                    friend={req} 
                    isRequestMode={true} 
                    onAccept={handleAcceptRequest} 
                    onReject={handleRejectRequest} 
                  />
                ))
              ) : (
                <div className="placeholder-container">
                  <p className="placeholder-text">✉️ No hay solicitudes pendientes.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedFriend && (
        <ConfirmModal 
          type={modalMode === "add" ? "success" : "danger"} 
          message={modalMode === "add" ? `¿Enviar solicitud a "${selectedFriend.name}"?` : `¿Eliminar a "${selectedFriend.name}"?`}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Friends;