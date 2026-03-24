import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FriendsFilter from "../components/FriendsFilter";
import FriendItem from "../components/FriendsItem"; 
import ConfirmModal from "../components/ConfirmModal";
import SearchBar from "../components/SearchBox"; 
import "../styles/Friends.css";

import { 
  getMyFriends, 
  searchUsers, 
  deleteFriend, 
  sendFriendRequest, 
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest 
} from "../services/userService";
import { getCheckMe } from "../services/authService";

const Friends = () => {
  const navigate = useNavigate();
  
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Mis Amigos");
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalMode, setModalMode] = useState("delete");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);

  const suggestedUsers = [
    { id: "sug-3", name: "Jugador 3", coins: 300, icon: "😎", status: "" },
    { id: "sug-4", name: "Jugador 4", coins: 150, icon: "🎯", status: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [friendsData, meData, pendingData] = await Promise.all([
          getMyFriends(),
          getCheckMe(),
          getPendingRequests()
        ]);
        setCurrentUser(meData);
        const mappedReqs = pendingData.map(req => {
          const identifier = typeof req === 'object' ? req.id_usuario_origen : req;
          const displayName = (typeof req === 'object' && req.nombre_usuario) ? req.nombre_usuario : identifier;
          return { id: identifier, name: displayName, coins: 0, icon: "👤" };
        });
        setPendingRequests(mappedReqs);
        const mappedFriends = friendsData.map(f => {
          const isObj = typeof f === 'object' && f !== null;
          const name = isObj ? (f.nombre_usuario || f.name) : f;
          const id = isObj ? (f.id || name) : name;
          return { id: id, name: name, coins: 0, icon: "👤", status: "Offline" };
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
    if (activeTab !== "Buscar Amigos" || searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await searchUsers(searchQuery);
        const mapped = data
          .map(res => ({
            id: res.id || res,
            name: res.nombre_usuario || res,
            coins: res.monedas || 0,
            icon: "👤",
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

  const usersToDisplay = searchQuery.trim() === "" ? suggestedUsers : searchResults;

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
      toast.success(`¡Ahora eres amigo de ${user.name}!`);
    } catch (error) {
      toast.error("No se pudo aceptar la solicitud");
    }
  };

  const handleRejectRequest = async (user) => {
    try {
      await rejectFriendRequest(user.id);
      setPendingRequests(prev => prev.filter(r => r.id !== user.id));
      toast.error("Solicitud rechazada");
    } catch (error) {
      toast.error("Error al rechazar la solicitud");
    }
  };

  const handleConfirm = async () => {
    if (modalMode === "add") {
      try {
        await sendFriendRequest(selectedFriend.id);
        
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
                    {searchQuery.trim() === "" && <p className="search-hint">Sugerencias para ti:</p>}
                    {usersToDisplay.map(user => (
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