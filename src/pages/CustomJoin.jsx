import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { playSound } from "../utils/sounds";
import { joinGameByCode } from "../services/gameService";
import "../styles/ConnectionSelector.css";

const CustomJoin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomCode, setRoomCode] = useState("");

  const handleJoin = async () => {
    const code = roomCode.trim();
    if (code.length !== 6) {
      toast.error("El código debe tener 6 caracteres");
      return;
    }

    try {
      const data = await joinGameByCode(code);
      const gameId = data.gameId;

      if (!gameId) {
        toast.error("Error al obtener el ID de la partida");
        return;
      }

      playSound("success");
      navigate("/lobby", {
        state: {
          gameId,
          roomCode: code,
          mode: "custom",
          customFlags: location.state?.customFlags || null,
          isPublic: false,
          isMultiplayer: true,
          isIA: false,
        },
      });
    } catch (error) {
      console.error("Error al unirse por código:", error);
      toast.error("Código de sala no válido o partida llena");
    }
  };

  return (
    <div className="conn-overlay">
      <div className="conn-card">
        <button className="ps-back-btn conn-back" onClick={() => navigate(-1)}>
          <span className="arrow">↩</span> Volver
        </button>

        <h1 className="conn-main-title">UNO</h1>

        <div className="conn-mode-info">
          <span className="conn-icon">🛠️</span>
          <div className="conn-texts">
            <h2 className="conn-mode-title">Partida personalizada</h2>
            <p className="conn-subtitle">Unirse con código</p>
          </div>
        </div>

        <div className="join-input-group">
          <label className="join-label">Código de la partida:</label>
          <input
            type="text"
            className="join-input"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={6}
          />
        </div>

        <button
          className="ps-start-btn conn-btn join-confirm-btn"
          onClick={handleJoin}
        >
          Unirse partida
        </button>
      </div>
    </div>
  );
};

export default CustomJoin;