import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import PlayerSelector from "../components/PlayerSelector";
import { createGame, joinGameById } from "../services/gameService";

const ModoRols = () => {
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
          const joinData = await joinGameById({ mode: "roles", maxJugadores: parseInt(numPlayers, 10) });
          
          navigate("/lobby", {
            state: {
              gameId: joinData.gameId,
              isPublic: true,
              isMultiplayer: true,
              mode: mode || "roles",
              players: parseInt(numPlayers, 10)
            }
          });
          return;
        } catch (error) {
          if (error.response?.status !== 404) throw error;
        }
      }

      const configParaEnviar = {
        maxJugadores: parseInt(numPlayers, 10),
        privada: !isPublic,
        modoCartasEspeciales: false,
        modoRoles: true,
        numCartasInicio: 7,
        timeoutTurno: 30
      };


      const data = await createGame(configParaEnviar);
      

      const stateParaLobby = {
        mode: mode || "roles",
        players: data.maxJugadores || configParaEnviar.maxJugadores,
        isPublic: isPublic,
        isMultiplayer: isMultiplayer || isPublic,
        roomCode: data.codigo,
        gameId: data.gameId,
        isIA: !isMultiplayer && !isPublic
      };


      navigate("/lobby", { state: stateParaLobby });

    } catch (error) {
      toast.error("Error al gestionar la partida");
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
        isMultiplayer={isMultiplayer || isPublic}
      />
    </div>
  );
};

export default ModoRols;