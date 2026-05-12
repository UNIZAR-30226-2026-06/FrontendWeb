import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FriendsFilter from "../components/FriendsFilter";
import FriendItem from "../components/FriendsItem"; 
import ConfirmModal from "../components/ConfirmModal";
import SearchBar from "../components/SearchBox"; 
import { useSocket } from "../context/SocketContext";
import "../styles/Friends.css";
import { getMyFriends, searchUsers, deleteFriend, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "../services/userService";
import { getCheckMe } from "../services/authService";

const Friends = () => {
  const navigate = useNavigate();
  const { 
    pendingRequests, 
    setPendingRequests, 
    sendNewFriendRequest, 
    sendFriendRequestAccepted, 
    sendFriendRequestRejected,
    onlineFriends,
    socket
  } = useSocket();
  
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

  const onlineFriendsRef = React.useRef(onlineFriends);
  useEffect(() => { onlineFriendsRef.current = onlineFriends; }, [onlineFriends]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [friendsData, meData] = await Promise.all([ getMyFriends(), getCheckMe() ]);
        setCurrentUser(meData);

        const mappedFriends = friendsData.map(f => {
          const isObj = typeof f === 'object' && f !== null;
          const name = isObj ? f.nombre_usuario : f;
          const id = isObj ? (f.id_usuario || f.nombre_usuario) : f;
          const avatarId = isObj ? f.avatar : null;
          const coins = isObj ? (f.monedas ?? 0) : 0;
          const status = onlineFriendsRef.current.includes(name) ? "Online" : "Offline";

          return { id, name, coins, avatarId, icon: "👤", status };
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
    setFriendsList(prev => prev.map(friend => ({
      ...friend,
      status: onlineFriends.includes(friend.name) ? "Online" : "Offline"
    })));
  }, [onlineFriends]);

  // Realtime: actualiza la lista cuando el otro usuario acepta o elimina
  useEffect(() => {
    if (!socket) return;

    const handleFriendAdded = (payload) => {
      const name = payload?.nombre_usuario;
      if (!name) return;
      setFriendsList(prev => {
        if (prev.some(f => f.name === name)) return prev;
        const isOnline = onlineFriendsRef.current.includes(name);
        return [
          ...prev,
          {
            id: name,
            name,
            coins: payload.monedas ?? 0,
            avatarId: payload.avatar ?? null,
            icon: "👤",
            status: isOnline ? "Online" : "Offline"
          }
        ];
      });
    };

    const handleFriendRemoved = (payload) => {
      const name = payload?.nombre_usuario;
      if (!name) return;
      setFriendsList(prev => prev.filter(f => f.name !== name && f.id !== name));
    };

    socket.on("friends:added", handleFriendAdded);
    socket.on("friends:removed", handleFriendRemoved);

    return () => {
      socket.off("friends:added", handleFriendAdded);
      socket.off("friends:removed", handleFriendRemoved);
    };
  }, [socket]);

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
        
        if (!data || !Array.isArray(data)) return;

        const mapped = data.map(res => {
          const isObj = typeof res === 'object' && res !== null;
          
          return {
            id: isObj ? (res.id_usuario || res.nombre_usuario || res.id) : res,
            name: isObj ? (res.nombre_usuario || res.username) : res,
            coins: isObj ? (res.monedas ?? 0) : 0, 
            avatarId: isObj ? (res.avatar || res.avatarId) : null,
            icon: "👤",
            status: ""
          };
        })
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

  const refetchFriends = async () => {
    try {
      const friendsData = await getMyFriends();
      const mappedFriends = friendsData.map(f => {
        const isObj = typeof f === 'object' && f !== null;
        const name = isObj ? f.nombre_usuario : f;
        const id = isObj ? (f.id_usuario || f.nombre_usuario) : f;
        const avatarId = isObj ? f.avatar : null;
        const coins = isObj ? (f.monedas ?? 0) : 0;
        const status = onlineFriendsRef.current.includes(name) ? "Online" : "Offline";
        return { id, name, coins, avatarId, icon: "👤", status };
      });
      setFriendsList(mappedFriends);
    } catch (_) {
    }
  };

  const handleAcceptRequest = async (user) => {
    try {
      await acceptFriendRequest(user.id);
      setPendingRequests(prev => prev.filter(r => r.id !== user.id));
      sendFriendRequestAccepted(user.name);
      toast.success(`¡Ahora eres amigo de ${user.name}!`);
      refetchFriends();
    } catch (error) {
      toast.error("No se pudo aceptar la solicitud");
    }
  };

  const handleRejectRequest = async (user) => {
    try {
      await rejectFriendRequest(user.id);
      setPendingRequests(prev => prev.filter(r => r.id !== user.id));
      sendFriendRequestRejected(user.name);
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
        toast.success("Solicitud enviada", { description: `Invitación enviada a ${selectedFriend.name}.`, icon: "📩" });
      } catch (error) {
        toast.error("Error al enviar solicitud");
      }
    } else {
      try {
        await deleteFriend(selectedFriend.id);
        toast.error("Amigo eliminado", { description: `${selectedFriend.name} eliminado correctamente.`, icon: "🗑️" });
        refetchFriends();
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