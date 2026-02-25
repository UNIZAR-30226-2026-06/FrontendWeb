import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PlayerSelector from "../components/PlayerSelector";

const ModoCards = () => {
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

  const reglasCards = [
    "Juega una carta que coincida en color o número.",
    "Si no tienes cartas, debes robar una del mazo.",
    "Cartas +2 y +4 acumulan el castigo al siguiente jugador.",
    "¡No olvides gritar UNO cuando te quede una sola carta!"
  ];

  return (
    <div className="page-wrapper">
      <PlayerSelector 
        title="Modo cartas"
        icon="⚡" 
        subtitle={dynamicSubtitle} 
        minPlayers={2}
        maxPlayers={4}
        rules={reglasCards}
        onStart={handleStartGame}
        isMultiplayer={isMultiplayer}
      />
    </div>
  );
};

export default ModoCards;