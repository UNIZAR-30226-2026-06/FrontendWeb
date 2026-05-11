import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import PlayerSelector from "../components/PlayerSelector";
import { createGame, joinGameById } from "../services/gameService";

const ModoCards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isPublic, isMultiplayer, mode } = location.state || {};

  let dynamicSubtitle = "Partida vs IA";
  if (isPublic) {
    dynamicSubtitle = "Partida Pública";
  } else if (isMultiplayer) {
    dynamicSubtitle = "Partida Multijugador";
  }

  const handleStartGame = async (numPlayers) => {
    try {
      if (isPublic) {
        try {
          const joinData = await joinGameById({ mode: "cards", maxJugadores: parseInt(numPlayers) });
          navigate("/lobby", {
            state: {
              gameId: joinData.gameId,
              isPublic: true,
              isMultiplayer: true,
              mode: mode || "cards",
              players: parseInt(numPlayers)
            }
          });
          return;
        } catch (error) {
          if (error.response?.status !== 404) throw error;
        }
      }

      const gameConfig = {
        maxJugadores: parseInt(numPlayers),
        privada: !isPublic,
        modoCartasEspeciales: true,
        modoRoles: false,
        numCartasInicio: 7,
        timeoutTurno: 30
      };
      const data = await createGame(gameConfig);

      navigate("/lobby", {
        state: {
          mode: mode || "cards",
          players: numPlayers,
          isPublic: isPublic,
          isMultiplayer: isMultiplayer || isPublic,
          roomCode: data.codigo,
          gameId: data.gameId,
          isIA: !isMultiplayer && !isPublic
        }
      });
    } catch (error) {
      console.error("Error al crear partida:", error);
      toast.error("No se pudo crear la partida de cartas");
    }
  };

  const reglasCards = [
    "Juega una carta que coincida en color o número.",
    "Si no tienes cartas, debes robar una del mazo.",
    "Cartas +2 y +4 acumulan el castigo al siguiente jugador.",
    "Las cartas especiales (Rayos, Bloqueos) activan efectos únicos."
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
        isMultiplayer={isMultiplayer || isPublic}
      />
    </div>
  );
};

export default ModoCards;