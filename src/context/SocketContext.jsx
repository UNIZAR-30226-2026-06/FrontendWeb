import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { getConnectedFriends } from "../services/userService";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socketInstance = io("http://localhost:3000", {
      auth: { token }
    });

    setSocket(socketInstance);

    const fetchOnlineFriends = async () => {
      try {
        const data = await getConnectedFriends();
        
        console.log("🟢 Datos amigos online:", data);

        const mappedNames = Array.isArray(data) 
          ? data.map(f => typeof f === 'object' ? (f.nombre_usuario || f.name) : f)
          : [];
          
        setOnlineFriends(mappedNames);
      } catch (e) {
        console.error("Error al obtener amigos online:", e);
      }
    };

    socketInstance.on("connect", () => {
      socketInstance.emit("pendingFriendRequests", {});
      fetchOnlineFriends();
    });

socketInstance.on("listaAmigosInicial", (listaNombres) => {
      console.log("📥 Recibida lista inicial de amigos online:", listaNombres);
      setOnlineFriends(listaNombres); 
    });
    socketInstance.on("amigoConectado", (nombre) => {
      console.log("🟢 Amigo se acaba de conectar:", nombre);
      setOnlineFriends((prev) => {
        if (!prev.includes(nombre)) return [...prev, nombre];
        return prev;
      });
    });

    socketInstance.on("amigoDesconectado", (data) => {
      console.log("🔌 SOCKET: Evento amigoDesconectado recibido:", data);
      const nombre = typeof data === 'object' ? (data.nombre_usuario || data.name) : data;
      setOnlineFriends((prev) => prev.filter(name => name !== nombre));
    });

    socketInstance.on("res_pendingFriendRequests", (data) => {
      if (Array.isArray(data)) {
        const mappedReqs = data.map(req => ({
          id: req.id_usuario_origen,
          name: req.nombre_usuario || req.id_usuario_origen,
          coins: 0,
          icon: req.image || "👤"
        }));
        setPendingRequests(mappedReqs);
      }
    });

    socketInstance.on("mostrarFriendRequest", () => {
      socketInstance.emit("pendingFriendRequests", {});
      toast.info("¡Has recibido una nueva solicitud de amistad! 📩");
    });

    socketInstance.on("mostrarAceptadaFriendRequest", (data) => {
      const nombreAmigo = data || "Un usuario";
      toast.success(`¡${nombreAmigo} ha aceptado tu solicitud de amistad! 🎉`);
    });

    socketInstance.on("mostrarRechazadaFriendRequest", (data) => {
      const nombreAmigo = data || "Un usuario";
      toast.error(`Tu solicitud a ${nombreAmigo} fue rechazada. ❌`);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendNewFriendRequest = (friendId) => {
    if (socket) socket.emit("newFriendRequest", String(friendId).trim());
  };

  const sendFriendRequestAccepted = (friendId) => {
    if (socket) socket.emit("newFriendRequestAccepted", String(friendId).trim());
  };

  const sendFriendRequestRejected = (friendId) => {
    if (socket) socket.emit("newFriendRequestReject", String(friendId).trim());
  };

  const joinGameRoom = (partidaID) => {
    if (socket) socket.emit("unirse_room_partida", partidaID);
  };

  const value = { 
    pendingRequests, 
    setPendingRequests, 
    onlineFriends,
    sendNewFriendRequest, 
    sendFriendRequestAccepted, 
    sendFriendRequestRejected, 
    joinGameRoom,
    socket 
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);