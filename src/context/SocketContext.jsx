import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

// 1. Calculamos la URL base dinámica quitando el '/api/v1' de la variable de entorno
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : "http://localhost:3000";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const socketRef = useRef(null);

  const setupSocket = useCallback((token) => {
    if (socketRef.current?.connected) return;

    // 2. Usamos la variable SOCKET_URL en lugar del localhost escrito a mano
    const socketInstance = io(SOCKET_URL, {
      auth: { token }
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      socketInstance.emit("pendingFriendRequests", {});
      socketInstance.emit("avisarAmigosConectados_UserOnline");
    });

    socketInstance.on("listaAmigosInicial", (listaNombres) => {
      setOnlineFriends(Array.isArray(listaNombres) ? listaNombres : []);
    });

    socketInstance.on("amigoConectado", (nombre) => {
      setOnlineFriends((prev) =>
        prev.includes(nombre) ? prev : [...prev, nombre]
      );
    });

    socketInstance.on("amigoDesconectado", (data) => {
      const nombre = typeof data === "object" ? (data.nombre_usuario || data.name) : data;
      setOnlineFriends((prev) => prev.filter((n) => n !== nombre));
    });

    socketInstance.on("res_pendingFriendRequests", (data) => {
      if (Array.isArray(data)) {
        setPendingRequests(data.map(req => ({
          id: req.id_usuario_origen,
          name: req.nombre_usuario || req.id_usuario_origen,
          coins: req.monedas ?? 0,
          avatarId: req.avatar ?? null,
          icon: "👤"
        })));
      }
    });

    socketInstance.on("mostrarFriendRequest", () => {
      socketInstance.emit("pendingFriendRequests", {});
      toast.info("¡Has recibido una nueva solicitud de amistad! 📩");
    });

    socketInstance.on("mostrarAceptadaFriendRequest", (data) => {
      toast.success(`¡${data || "Un usuario"} ha aceptado tu solicitud de amistad! 🎉`);
    });

    socketInstance.on("mostrarRechazadaFriendRequest", (data) => {
      toast.error(`Tu solicitud a ${data || "un usuario"} fue rechazada. ❌`);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setupSocket(token);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("avisarAmigosConectados_UserDisconnect");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [setupSocket]);

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) setupSocket(token);
  }, [setupSocket]);

  const disconnectSocket = useCallback(() => {
    const s = socketRef.current;
    if (s) {
      s.emit("avisarAmigosConectados_UserDisconnect");
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setOnlineFriends([]);
    }
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
    connectSocket,
    disconnectSocket,
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