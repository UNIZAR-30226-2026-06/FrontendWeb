import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socketInstance = io("http://localhost:3000", {
      auth: { token }
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      socketInstance.emit("pendingFriendRequests", {});
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
      socketInstance.off("res_pendingFriendRequests");
      socketInstance.off("mostrarFriendRequest");
      socketInstance.off("mostrarAceptadaFriendRequest");
      socketInstance.off("mostrarRechazadaFriendRequest");
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

  const value = { pendingRequests, setPendingRequests, sendNewFriendRequest, sendFriendRequestAccepted, sendFriendRequestRejected };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);