import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { sendChatMessage } from "../services/chatService";
import { toast } from "sonner";
import "../styles/GameChat.css";

const GameChat = ({ gameId, messages, onClose }) => {
  const { socket } = useSocket();
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setSending(true);
    try {
      await sendChatMessage(gameId, inputValue);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="game-chat-container">
      <div className="game-chat-header">
        <h3>Chat de Partida</h3>
        <button className="chat-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="game-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <span className="chat-sender">{msg.remitente}:</span>
            <span className="chat-text">{msg.texto}</span>
            <span className="chat-time">
              {new Date(msg.hora).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="game-chat-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe un mensaje..."
          maxLength={150}
          rows={3}
          disabled={sending}
        />
        <button 
          onClick={handleSendMessage} 
          className="chat-send-btn"
          disabled={sending}
        >
          {sending ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default GameChat;