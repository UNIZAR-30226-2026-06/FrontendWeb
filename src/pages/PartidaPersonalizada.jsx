import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomGameSelector from "../components/CustomGameSelector";
import { createGame } from "../services/gameService";

const PartidaPersonalizada = () => {
  const navigate = useNavigate();

  const handleCreateGame = async (config) => {
    const { customFlags, initialCards } = config;

    const gameConfig = {
      maxJugadores: 4,
      privada: true,
      modoRoles:           !!customFlags.roles,
      modoCartasEspeciales: !!customFlags.cartas,
      numCartasInicio: Number(initialCards) || 7,
      timeoutTurno: 30,
    };

    try {
      const data = await createGame(gameConfig);

      navigate("/lobby", {
        state: {
          gameId: data.gameId,
          roomCode: data.codigo,
          mode: "custom",
          customFlags,
          players: 4,
          isPublic: false,
          isMultiplayer: true,
          isIA: false,
        },
      });
    } catch (error) {
      console.error("Error al crear partida personalizada:", error);
      toast.error("No se pudo crear la partida personalizada");
    }
  };

  return (
    <div className="page-wrapper">
      <CustomGameSelector onStart={handleCreateGame} />
    </div>
  );
};

export default PartidaPersonalizada;