import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { getGameInfo, startGame, addBot } from "../services/gameService";
import { getCheckMe } from "../services/authService";
import { useSocket } from "../context/SocketContext";
import "../styles/Lobby.css";


const playerVariants = {
  hidden: { opacity: 0, scale: 0.5, x: 40, filter: "blur(12px)" },
  visible: (i) => ({
    opacity: 1, scale: 1, x: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 22, delay: i * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.7, filter: "blur(8px)", transition: { duration: 0.2 } },
};

const emptySlotVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    mode,
    roomCode,
    gameId,
    isIA,
    isPublic,
    players: playersFromState,
    customFlags: customFlagsFromState,
  } = location.state || {};
  const { socket } = useSocket();

  const [gameData, setGameData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const joinedRoom = useRef(false);
  const botsAddedRef = useRef(0);
  const btnControls = useAnimation();

  const isCustom = mode === "custom";

  const customFlags = (() => {
    if (customFlagsFromState) return customFlagsFromState;
    if (!gameData) return null;
    const roles  = !!(gameData.modo_roles ?? gameData.modoRoles);
    const cartas = !!(gameData.modo_cartas_especiales ?? gameData.modoCartasEspeciales);
    return { normal: !roles && !cartas, roles, cartas };
  })();

  const config = {
    roles:  { title: "Modo con roles", icon: "🎭" },
    cards:  { title: "Modo cartas",    icon: "⚡" },
    normal: { title: "Modo normal",    icon: "🎴" },
    custom: { title: "Modo personalizado", icon: "🛠️" },
  };

  const customSubtitle = (() => {
    if (!isCustom || !customFlags) return null;
    const parts = [];
    if (customFlags.normal) parts.push("Normal");
    if (customFlags.roles)  parts.push("Roles");
    if (customFlags.cartas) parts.push("Cartas esp.");
    return parts.length ? parts.join(" + ") : null;
  })();

  const currentMode = config[mode] || config.roles;

  const refreshSeqRef = useRef(0);
  const lastAppliedSeqRef = useRef(0);

  const refreshData = useCallback(async () => {
    const mySeq = ++refreshSeqRef.current;
    try {
      const data = await getGameInfo(gameId);
      if (mySeq >= lastAppliedSeqRef.current) {
        lastAppliedSeqRef.current = mySeq;
        setGameData(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [gameId]);

  const addingBotLockRef = useRef(false);
  const [isAddingBot, setIsAddingBot] = useState(false);

  const handleAddBot = () => {
    if (addingBotLockRef.current) return;
    if (players.length >= maxPlayers) return;
    addingBotLockRef.current = true;
    setIsAddingBot(true);
    socket.emit("unir_bot", { partidaID: gameId });
    setTimeout(() => {
      addingBotLockRef.current = false;
      setIsAddingBot(false);
    }, 500);
  };

  const loadInitialData = async () => {
    const mySeq = ++refreshSeqRef.current;
    try {
      setLoading(true);
      const [info, me] = await Promise.all([getGameInfo(gameId), getCheckMe()]);
      if (mySeq >= lastAppliedSeqRef.current) {
        lastAppliedSeqRef.current = mySeq;
        setGameData(info);
      }
      setCurrentUser(me);
    } catch {
      toast.error("Error al conectar con la sala");
      navigate("/home");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!gameId) { navigate("/home"); return; }
    loadInitialData();
  }, [gameId]);

  const navigateRef = useRef(navigate);
  const refreshRef = useRef(refreshData);
  const modeRef = useRef(mode);
  const customFlagsRef = useRef(null);
  const isPublicRef = useRef(isPublic);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  useEffect(() => { refreshRef.current = refreshData; }, [refreshData]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { customFlagsRef.current = customFlags; }, [customFlags]);
  useEffect(() => { isPublicRef.current = isPublic; }, [isPublic]);

  useEffect(() => {
    if (!socket || !gameId) return;

    const handleNuevoJugador = (data) => {
      refreshRef.current();
      toast.info(`${typeof data === "object" ? data.jugador : data} se ha unido`);
    };
    const handlePartidaIniciada = (data) => {
      const gameMode = modeRef.current === "custom" ? "custom" : (data.mode || modeRef.current);
      navigateRef.current("/game", {
        state: {
          gameId: data.gameId,
          mode: gameMode,
          manoInicial: data.manoInicial,
          customFlags: customFlagsRef.current,
          isPublic: isPublicRef.current,
        },
        replace: true,
      });
    };
    const handleBotsUnidos = (data) => {
      refreshRef.current();
      if (isIA) {
        toast.success(`${data.botIds?.length || ''} bot(s) añadido(s)`);
      }
    };
    const handleBotUnido = (data) => {
      if (!isIA) {
        refreshRef.current();
        toast.success(data.mensaje || "Bot añadido correctamente");
        setIsAddingBot(false);
      }
    };
    const handleErrorUnirBot = (data) => {
      toast.error(data.message || "Error al añadir bot");
      setIsAddingBot(false);
    };

    socket.on("nuevo_jugador", handleNuevoJugador);
    socket.on("partida_iniciada", handlePartidaIniciada);
    socket.on("bot_unido", handleBotUnido);
    socket.on("bots_unidos", handleBotsUnidos);
    socket.on("error_unir_bot", handleErrorUnirBot);

    const intentarUnionConBot = () => {
      if (socket.connected && !joinedRoom.current) {
        joinedRoom.current = true;
        socket.emit("unirse_partida", { partidaID: gameId });
        refreshRef.current();

        if (isIA) {
          const numBots = (playersFromState || 2) - 1;
          setTimeout(() => {
            socket.emit("unir_bots", { partidaID: gameId, numBots });
          }, 500);
        }
      }
    };

    if (socket.connected) intentarUnionConBot(); else socket.once("connect", intentarUnionConBot);

    return () => {
      socket.off("nuevo_jugador", handleNuevoJugador);
      socket.off("partida_iniciada", handlePartidaIniciada);
      socket.off("bot_unido", handleBotUnido);
      socket.off("bots_unidos", handleBotsUnidos);
      socket.off("error_unir_bot", handleErrorUnirBot);
      socket.off("connect", intentarUnionConBot);
    };
  }, [socket, gameId]); 

  const players = gameData?.jugadores || [];
  const maxPlayers = gameData?.max_jugadores || gameData?.maxJugadores || playersFromState || 4;
  const lobbyFull = players.length >= maxPlayers;

  const getPlayerName = (p) => { if (!p) return ""; if (typeof p === "string") return p; return p.nombre_usuario || p.nombre || p.id; };
  const currentUserName = currentUser?.nombre_usuario || currentUser?.nombre;
  const isHost = getPlayerName(players[0]) === currentUserName;

  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!socket || !gameId) return;
    if (isCustom) return; 
    if (!lobbyFull || !isHost) return;
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;

    setTimeout(async () => {
      try {
        const fresh = await getGameInfo(gameId);
        const freshPlayers = fresh?.jugadores?.length ?? 0;
        const freshMax = fresh?.max_jugadores || fresh?.maxJugadores || maxPlayers;
        if (freshPlayers < freshMax) {
          autoStartedRef.current = false;
          refreshRef.current();
          console.warn(
            `[autostart] Abortado: backend reporta ${freshPlayers}/${freshMax}.`
          );
          return;
        }
        socket.emit("start_game", { partidaID: gameId });
        toast.success("Iniciando partida...");
      } catch (err) {
        console.error("[autostart] Verificación fallida, emitimos igualmente:", err);
        socket.emit("start_game", { partidaID: gameId });
        toast.success("Iniciando partida...");
      }
    }, 300);
  }, [lobbyFull, isHost, socket, gameId, isCustom, maxPlayers]);

  useEffect(() => {
    if (lobbyFull) {
      btnControls.start({
        boxShadow: [
          "0 0 0px #62b155, inset 0 0 0px #62b155",
          "0 0 18px #62b155, inset 0 0 8px rgba(98,177,85,0.25)",
          "0 0 6px #62b155,  inset 0 0 2px rgba(98,177,85,0.1)",
          "0 0 18px #62b155, inset 0 0 8px rgba(98,177,85,0.25)",
          "0 0 0px #62b155,  inset 0 0 0px #62b155",
        ],
        borderColor: [
          "rgba(98,177,85,0.3)",
          "rgba(98,177,85,1)",
          "rgba(98,177,85,0.6)",
          "rgba(98,177,85,1)",
          "rgba(98,177,85,0.3)",
        ],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      });
    } else {
      btnControls.stop();
      btnControls.set({ boxShadow: "0 0 0px transparent", borderColor: "transparent" });
    }
  }, [lobbyFull, btnControls]);

  const handleStartGame = async () => {
    if (autoStartedRef.current) return;
    if (players.length < 2) return;
    autoStartedRef.current = true;
    try {
      socket.emit("start_game", { partidaID: gameId, configuracion: gameData });
      toast.success("Iniciando partida...");
    } catch {
      autoStartedRef.current = false;
      toast.error("Error al iniciar");
    }
  };

  if (loading || !gameData) return <div className="lobby-overlay"><p>Conectando a la sala...</p></div>;

  return (
    <div className="lobby-overlay">
      <div className="lobby-card">

        <div className="lobby-header">
          <button className="ps-back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">↩</span> Salir
          </button>
          <div className="lobby-room-info">
            <span className="code-label">CÓDIGO DE SALA</span>
            <span className="code-value">{roomCode || gameData.codigo}</span>
          </div>
        </div>

        <div className="lobby-mode-display">
          <span className="lobby-mode-icon">{currentMode.icon}</span>
          <div>
            <h2>Sala de Espera</h2>
            <p>
              {currentMode.title}
              {customSubtitle && (
                <span className="lobby-custom-subtitle"> · {customSubtitle}</span>
              )}
            </p>
          </div>
        </div>

        <div className="lobby-progress-container">
          <div className="lobby-stats">
            <span>Jugadores: {players.length}/{maxPlayers}</span>
            <span>{Math.round((players.length / maxPlayers) * 100)}%</span>
          </div>
          <div className="lobby-progress-bar">
            <motion.div
              className="lobby-progress-fill"
              animate={{ width: `${(players.length / maxPlayers) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="lobby-players-grid">
          {Array.from({ length: maxPlayers }).map((_, index) => {
            const player = players[index];
            const playerName = getPlayerName(player);
            const isBot = playerName?.toLowerCase().includes("bot") || player?.isBot;

            return (
              <AnimatePresence key={index} mode="wait">
                {player ? (
                  <motion.div
                    key={playerName || index}
                    className="player-slot occupied"
                    custom={index}
                    variants={playerVariants}
                    initial="hidden" animate="visible" exit="exit"
                  >
                    <motion.div
                      className="player-avatar"
                      initial={{ boxShadow: "0 0 0px rgba(98,177,85,0)" }}
                      animate={{ boxShadow: ["0 0 18px rgba(98,177,85,0.9)", "0 0 0px rgba(98,177,85,0)"] }}
                      transition={{ duration: 0.9, delay: index * 0.06 + 0.15 }}
                    >
                      {isBot ? "🤖" : playerName?.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="player-info">
                      <span className="player-name">
                        {playerName} {index === 0 && <span className="host-crown">👑</span>}
                      </span>
                      <span className="player-status ready">{index === 0 ? "HOST" : "CONECTADO"}</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${index}`}
                    className="player-slot empty"
                    variants={emptySlotVariants}
                    initial="hidden" animate="visible" exit="exit"
                    style={{ position: "relative" }}
                  >
                    <motion.div
                      style={{
                        position: "absolute", inset: 0,
                        borderRadius: "inherit",
                        border: "2px dashed #4d64a1",
                        pointerEvents: "none",
                      }}
                      animate={{
                        opacity: [0.35, 0.9, 0.35],
                        borderColor: ["#4d64a1", "#62b155", "#4d64a1"],
                      }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    />
                    <div className="slot-empty-container">
                      <div className="slot-empty-text">Esperando...</div>
                      {isHost && !isCustom && (
                        <button
                          className="add-bot-inline-btn"
                          onClick={handleAddBot}
                          disabled={isAddingBot}
                        >
                          {isAddingBot ? "..." : "+ Bot"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        <div className="lobby-actions">
          {isHost ? (
            <div className="host-actions-group">
              <motion.button
                className="ps-start-btn lobby-btn"
                onClick={handleStartGame}
                disabled={players.length < 2}
                animate={btnControls}
                whileHover={{ scale: players.length >= 2 ? 1.05 : 1 }}
                whileTap={{ scale: players.length >= 2 ? 0.96 : 1 }}
                style={{ border: "2px solid transparent" }}
              >
                {lobbyFull ? "⚡ ¡Todos listos!" : "Comenzar partida"}
              </motion.button>

              <AnimatePresence>
                {players.length < 2 && (
                  <motion.p
                    className="waiting-msg"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    Necesitas al menos 2 jugadores
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <p className="waiting-msg">Esperando al host...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Lobby;