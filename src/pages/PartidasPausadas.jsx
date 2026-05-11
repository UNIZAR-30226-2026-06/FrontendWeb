import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPausedGames } from "../services/gameService";
import PausedGameItem from "../components/PausedGameItem";
import "../styles/ConnectionSelector.css"; 
import "../styles/CustomGameSelector.css"; 

const PartidasPausadas = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await getPausedGames();
        setGames(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching paused games:", error);
        toast.error("Error al cargar partidas pausadas");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleResume = (gameId) => {
    toast.info("Reanudando partida...");
    navigate("/game", { state: { gameId, isResuming: true } });
  };

  return (
    <div className="conn-overlay">
      <div className="conn-card custom-card">
        <button className="ps-back-btn conn-back" onClick={() => navigate(-1)}>
          <span className="arrow">↩</span> Volver
        </button>

        <h1 className="conn-main-title">UNO</h1>

        <div className="custom-subtitle-group">
          <span className="edit-icon">⏳</span>
          <div>
            <h2 className="conn-mode-title">Partidas Pausadas</h2>
            <p className="conn-mini-text">Selecciona una para continuar</p>
          </div>
        </div>

        <div className="create-room-panel">
          <h3 className="panel-title">TUS PARTIDAS</h3>

          <div className="friends-content-list" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
            {loading ? (
              <p className="placeholder-text">Buscando tus partidas...</p>
            ) : games.length > 0 ? (
              games.map((game) => (
                <PausedGameItem 
                  key={game.id_partida} 
                  game={game} 
                  onResume={handleResume} 
                />
              ))
            ) : (
              <div className="placeholder-container" style={{ padding: '20px' }}>
                <span className="empty-icon">🏜️</span>
                <p className="placeholder-text">No tienes ninguna partida pausada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartidasPausadas;