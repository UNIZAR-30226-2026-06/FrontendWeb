import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PlayerSelector from "../components/PlayerSelector";

const ModoRoles = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isPublic, isMultiplayer } = location.state || {};

  let dynamicSubtitle = "Partida vs IA";
  if (isPublic) {
    dynamicSubtitle = "Partida Pública";
  } else if (isMultiplayer) {
    dynamicSubtitle = "Partida Multijugador"; 
  }

  const handleStartGame = (numPlayers) => {
    const { mode, isPublic, isMultiplayer } = location.state || {};
    if (isPublic) {
      navigate("/loading", { 
        state: { mode, players: numPlayers, isPublic: true, isMultiplayer: true } 
      });
    } 
    else if (isMultiplayer) {
      navigate("/lobby", { 
        state: { mode, players: numPlayers, isPublic: false, isMultiplayer: true, roomCode: "ABCXYZ" } 
      });
    } 
    else {
      navigate("/loading", { 
        state: { mode, players: numPlayers, isPublic: false, isMultiplayer: false } 
      });
    }
  };

  const reglasRoles = [
    "Cada jugador recibe un rol secreto al inicio.",
    "El Asesino debe eliminar a los demás sin ser descubierto.",
    "El Guardián puede proteger a un jugador cada turno.",
    "Usa tus cartas especiales para activar habilidades de rol."
  ];

  return (
    <div className="page-wrapper">
      <PlayerSelector 
        title="Modo con roles"
        icon="🎭"
        subtitle={dynamicSubtitle} 
        minPlayers={2}
        maxPlayers={4}
        rules={reglasRoles}
        onStart={handleStartGame}
        isMultiplayer={isMultiplayer} 
      />
    </div>
  );
};

export default ModoRoles;