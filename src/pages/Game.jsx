import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import GameHeader from "../components/GameHeader";
import GameBoard from "../components/GameBoard";
import SettingsModal from "../components/SettingsModal";
import GameChat from "../components/GameChat";
import RoleOverlay from "../components/RoleOverlay";
import HandSideButtons from "../components/HandSideButtons";
import GameOverScreen from "../components/GameOverScreen";
import PauseScreen from "../components/PauseScreen";
import ResumeWaitingScreen from "../components/ResumeWaitingScreen";
import PauseVoteBanner from "../components/PauseVoteBanner";
import ColorPicker from "../components/ColorPicker";

import { getGameState, playCard, drawCard } from "../services/gameService";
import { getCheckMe } from "../services/authService";
import { getMyProfile } from "../services/userService";
import { getPlayerRole } from "../services/roleService";
import { useSocket } from "../context/SocketContext";
import "../styles/GameScreen.css";

const ESTILOS_MAP = { 2: "basic", 3: "neon", 4: "gold", 5: "retro" };

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const { gameId, mode, isPublic, manoInicial, customFlags } = location.state || {};

  const rolesActivosLocal = mode === "custom" ? !!customFlags?.roles : mode === "roles";

  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRolePanel, setShowRolePanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [gameOver, setGameOver] = useState(null);
  const [gameState, setGameState] = useState(null);
  const rolesActivos = gameState?.rolesMode ?? rolesActivosLocal;
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStyle, setActiveStyle] = useState("basic");
  const [myAvatar, setMyAvatar] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [playerRole, setPlayerRole] = useState(null);
  const [roleRevealed, setRoleRevealed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseVoteBanner, setPauseVoteBanner] = useState(null);
  const [resumeWaiting, setResumeWaiting] = useState(false);
  const [resumeVotes, setResumeVotes] = useState(0);
  const [resumeVoters, setResumeVoters] = useState([]);
  const [thinkingBotId, setThinkingBotId] = useState(null);
  const [colorPickerState, setColorPickerState] = useState(null);
  const [pauseVoters, setPauseVoters] = useState([]);
  const [turnSecondsLeft, setTurnSecondsLeft] = useState(null);

  const hasRequestedResume = useRef(false);
  const hasVotedPause = useRef(false);
  const hasVotedResume = useRef(false); 
  const roleRevealedRef = useRef(false);
  const currentUserRef = useRef(null);
  const showChatRef = useRef(false);

  useEffect(() => { showChatRef.current = showChat; }, [showChat]);

  const loadData = useCallback(async (retryCount = 0) => {
    try {
      const [state, me, profile] = await Promise.all([
        getGameState(gameId),
        getCheckMe(),
        getMyProfile(),
      ]);

      if (state.phase === "waiting" && retryCount < 5) {
        setTimeout(() => loadData(retryCount + 1), 800);
        return;
      }
      const role = (state.phase === "playing" || state.phase === "paused")
        ? await getPlayerRole(gameId).catch(() => null)
        : null;

      const myUsername = me?.nombre_usuario || me?.nombre;
      const myPlayer = state.players?.find(p => p.id === myUsername);
      if (myPlayer && (!Array.isArray(myPlayer.hand) || myPlayer.hand.length === 0) && manoInicial?.length > 0) {
        myPlayer.hand = manoInicial;
      }

      setGameState(state);
      setCurrentUser(me);
      currentUserRef.current = me;
      setActiveStyle(ESTILOS_MAP[profile.estilo] || "basic");
      const myPlayerState = state.players?.find(p => p.id === myUsername);
      setMyAvatar(myPlayerState?.avatarImage || profile.avatar || null);

      if (state.phase === "paused") {
        setIsPaused(true);
        if (state.resumeVoters?.length > 0) {
          setResumeVoters(state.resumeVoters);
          setResumeVotes(state.resumeVoters.length);
          setResumeWaiting(true);
          const myName = me?.nombre_usuario || me?.nombre;
          if (state.resumeVoters.includes(myName)) {
            hasVotedResume.current = true;
            hasRequestedResume.current = true;
          }
        } else {
          setResumeWaiting(false);
        }
      } else {
        setIsPaused(false);
      }

      if (role) {
        setPlayerRole(role);
        if (!roleRevealedRef.current) {
          roleRevealedRef.current = true;
          setRoleRevealed(true);
          setShowRolePanel(true);
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar el estado del juego");
    }
  }, [gameId]);

  const joinedRoomRef = useRef(false);

  useEffect(() => {
    if (!gameId) { navigate("/home"); return; }
  }, [gameId]);

  useEffect(() => {
    if (!socket || !gameId || joinedRoomRef.current) return;

    const emitJoinAndLoad = () => {
      if (joinedRoomRef.current) return;
      joinedRoomRef.current = true;
      socket.emit("unirse_partida", { partidaID: gameId });
      setTimeout(() => loadData(), 150);
    };

    if (socket.connected) {
      emitJoinAndLoad();
    } else {
      socket.once("connect", emitJoinAndLoad);
      return () => socket.off("connect", emitJoinAndLoad);
    }
  }, [socket, gameId, loadData]);

  const loadDataRef = useRef(loadData);
  useEffect(() => { loadDataRef.current = loadData; }, [loadData]);

  useEffect(() => {
    if (!gameState?.turnDeadline) { setTurnSecondsLeft(null); return; }
    const tick = () => {
      const secs = Math.max(0, Math.ceil((gameState.turnDeadline - Date.now()) / 1000));
      setTurnSecondsLeft(secs);
      if (secs <= 0) clearInterval(iv);
    };
    tick();
    const iv = setInterval(tick, 500);
    return () => clearInterval(iv);
  }, [gameState?.turnDeadline]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => loadDataRef.current();

    socket.on("turno_expirado", () => { refresh(); });


    socket.on("game_state_updated", refresh);
    socket.on("nuevo_jugador", refresh);
    socket.on("turno_siguiente", refresh);
    socket.on("carta_robada", refresh);
    socket.on("carta_jugada", refresh);
    socket.on("partida_iniciada",   refresh);

    socket.on("bot_thinking", (data) => {
      setThinkingBotId(data?.botId ?? null);
    });

    socket.on("bot_action", () => {
      setThinkingBotId(null);
      refresh();
    });

    socket.on("game_finished", (data) => {
      setThinkingBotId(null);
      const me = currentUserRef.current;
      if (me) {
        const myId = me.nombre_usuario || me.nombre;
        if (data.monedasPerdedores && data.monedasPerdedores[myId] !== undefined) {
          const updated = { ...me, monedas: data.monedasPerdedores[myId] };
          setCurrentUser(updated);
          currentUserRef.current = updated;
        } else if (data.monedasTotales && myId === data.winner) {
          const updated = { ...me, monedas: data.monedasTotales };
          setCurrentUser(updated);
          currentUserRef.current = updated;
        }
      }
      setGameOver(data);
      refresh();
    });

    socket.on("nuevoMensajeChat", (msg) => {
      setChatMessages(prev => [...prev, msg]);
      if (!showChatRef.current) {
        setUnreadCount(prev => prev + 1);
      }
    });

    socket.on("voto_pausa", (data) => {
      setPauseVoters([data.jugador]);
      setPauseVoteBanner({ requestedBy: data.jugador });
    });

    socket.on("voto_pausa_registrado", (data) => {
      setPauseVoters(prev =>
        prev.includes(data.jugador) ? prev : [...prev, data.jugador]
      );
    });

    socket.on("partida_pausada", () => {
      setPauseVoteBanner(null);
      setPauseVoters([]);
      hasVotedPause.current = false;
      setResumeWaiting(false);
      setResumeVotes(0);
      setResumeVoters([]);
      hasVotedResume.current = false;
      hasRequestedResume.current = false;
      setIsPaused(true);
      refresh();
    });

    socket.on("pausa_rechazada", () => {
      setPauseVoteBanner(null);
      setPauseVoters([]);
      hasVotedPause.current = false;
    });

    socket.on("voto_reanudar", (data) => {
      const voters = data.voters || [data.jugador];
      setResumeVoters(voters);
      setResumeVotes(voters.length);
      setResumeWaiting(true);
    });

    socket.on("voto_reanudar_registrado", (data) => {
      const voters = data.voters || [];
      if (voters.length > 0) {
        setResumeVoters(voters);
        setResumeVotes(voters.length);
      } else {
        setResumeVoters(prev =>
          prev.includes(data.jugador) ? prev : [...prev, data.jugador]
        );
        setResumeVotes(v => v + 1);
      }
    });

    socket.on("partida_reanudada", () => {
      setResumeWaiting(false);
      setResumeVotes(0);
      setResumeVoters([]);
      hasRequestedResume.current = false;
      hasVotedResume.current = false;
      setIsPaused(false);
      toast.success("¡Partida reanudada!");
      refresh();
    });

    socket.on("voto_reanudar_retirado", (data) => {
      const voters = data.voters || [];
      setResumeVoters(voters);
      setResumeVotes(voters.length);
    });

    return () => {
      socket.off("game_state_updated", refresh);
      socket.off("nuevo_jugador", refresh);
      socket.off("turno_siguiente", refresh);
      socket.off("carta_robada", refresh);
      socket.off("carta_jugada", refresh);
      socket.off("partida_iniciada", refresh);
      socket.off("bot_thinking");
      socket.off("bot_action");
      socket.off("game_finished");
      socket.off("nuevoMensajeChat");
      socket.off("voto_pausa");
      socket.off("voto_pausa_registrado");
      socket.off("partida_pausada");
      socket.off("voto_reanudar");
      socket.off("voto_reanudar_registrado");
      socket.off("partida_reanudada");
      socket.off("voto_reanudar_retirado");
      socket.off("turno_expirado");
    };
  }, [socket]);

  const NEEDS_COLOR = new Set([
    'wild', '+4', '+4R', '+1', 'changeColor',
    'swapHands', 'discardHandRedraw', 'specialOnly',
  ]);
  const NEEDS_CANCEL_COLOR = new Set(['cancelColor']);

  const askColor = (card, mode = 'choose', extra = {}) => {
    return new Promise((resolve) => {
      setColorPickerState({
        card,
        mode,
        ...extra,
        resolver: resolve,
      });
    });
  };

  const closeColorPicker = (value) => {
    setColorPickerState((prev) => {
      if (prev?.resolver) prev.resolver(value);
      return null;
    });
  };

  const handlePlayCard = async (cardId, opts = {}) => {
    if (!gameState || gameState.phase !== "playing") {
      toast.info("La partida aún se está iniciando...");
      return { cancelled: true };
    }

    const card = opts.card;
    const requiresColor = card && NEEDS_COLOR.has(card.value);
    const requiresCancel = card && NEEDS_CANCEL_COLOR.has(card.value);

    if (requiresCancel) {
      const blocked = await askColor(card, 'cancel');
      if (!blocked) return { cancelled: true };
      try {
        await playCard(gameId, cardId, { cancelColor: blocked });
        loadData();
        return { cancelled: false };
      } catch (e) {
        toast.error(e.message);
        return { cancelled: true };
      }
    }

    if (requiresColor) {
      const chosen = await askColor(card, 'choose');
      if (!chosen) return { cancelled: true };
      try {
        await playCard(gameId, cardId, { chosenColor: chosen });
        loadData();
        return { cancelled: false };
      } catch (e) {
        toast.error(e.message);
        return { cancelled: true };
      }
    }

    try {
      await playCard(gameId, cardId);
      loadData();
      return { cancelled: false };
    } catch (e) {
      toast.error(e.message);
      return { cancelled: true };
    }
  };

  const handleDrawCard = async () => {
    if (!gameState || gameState.phase !== "playing") {
      toast.info("La partida aún se está iniciando...");
      return;
    }
    try { await drawCard(gameId); loadData(); }
    catch (e) { toast.error(e.message); }
  };

  const handlePauseClick = () => {
    if (hasVotedPause.current) return;
    hasVotedPause.current = true;
    const me = currentUserRef.current;
    const meId = me?.nombre_usuario || me?.nombre;
    setPauseVoters([meId]);
    socket?.emit("jugador_solicita_pausa", { partidaID: gameId });
    toast.info("Solicitud de pausa enviada");
  };

  const handleVoteYesPause = () => {
    if (hasVotedPause.current) return;
    hasVotedPause.current = true;
    const me = currentUserRef.current;
    const meId = me?.nombre_usuario || me?.nombre;
    setPauseVoters(prev => prev.includes(meId) ? prev : [...prev, meId]);
    setPauseVoteBanner(null);
    socket?.emit("jugador_voto_pausa", { partidaID: gameId });
  };

  const handleVoteNoPause = () => {
    setPauseVoteBanner(null);
    setPauseVoters([]);
    hasVotedPause.current = false;
    socket?.emit("jugador_rechaza_pausa", { partidaID: gameId });
  };

  const handleRequestResume = () => {
    if (hasVotedResume.current) return;
    hasVotedResume.current = true;
    hasRequestedResume.current = true;
    socket?.emit("jugador_solicita_reanudar", { partidaID: gameId });
  };

  const handleGoHome = () => {
    if (hasVotedResume.current && gameId) {
      socket?.emit("abandonar_voto_reanudar", { partidaID: gameId });
    }
    navigate("/home");
  };

  if (!gameState || !currentUser) {
    return <div>Cargando partida...</div>;
  }

  const myId        = currentUser.nombre_usuario || currentUser.nombre;
  const allPlayers  = gameState.players || [];
  const getPlayerId = (p) => p.id || p.nombre_usuario;

  const reorder = (players, me) => {
    const copy  = [...players];
    const index = copy.findIndex(p => getPlayerId(p) === me);
    if (index === -1) return copy;
    return [...copy.slice(index), ...copy.slice(0, index)];
  };

  const ordered = reorder(allPlayers, myId);
  const myPlayerData = ordered?.[0]?.id === myId
    ? ordered[0]
    : allPlayers.find(p => getPlayerId(p) === myId) || {};

  const opponents    = ordered?.slice(1) || [];
  const humanPlayers = allPlayers.filter(p => !p.isBot).length;
  const totalNeeded  = humanPlayers;

  const isMyTurn = !!myId && gameState?.currentTurn === myId;

  const rawHand = myPlayerData.hand ?? myPlayerData.mano ?? [];
  const myCards = Array.isArray(rawHand) ? rawHand : [];

  const isBotGame = humanPlayers === 1;
  const showPause = !isPublic;

  const handleOpenChat = () => {
    setShowChat(true);
    setUnreadCount(0);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const roleCanUse = !!(
    playerRole?.canUseNow &&
    isMyTurn &&
    ((playerRole?.maxUses ?? 0) - (playerRole?.uses ?? 0)) > 0
  );

  return (
    <div className="game-full-layout">

      <GameHeader
        totalPlayers={humanPlayers}
        pausedCount={pauseVoters.length}
        onPauseClick={handlePauseClick}
        onMenuClick={() => setShowSettings(true)}
        showPause={showPause}
      />

      <GameBoard
        myCards={myCards}
        currentTableCard={gameState.discardTop}
        opponents={opponents}
        onPlayCard={handlePlayCard}
        onDrawCard={handleDrawCard}
        cardStyle={activeStyle}
        isMyTurn={isMyTurn}
        thinkingBotId={thinkingBotId}
        currentTurnId={gameState?.currentTurn}
        myAvatar={myAvatar}
        currentUserId={myId}
        turnSecondsLeft={isMyTurn ? turnSecondsLeft : null}
      />

      <HandSideButtons
        onChatClick={handleOpenChat}
        onRoleClick={() => setShowRolePanel(true)}
        unreadCount={unreadCount}
        showRoleButton={rolesActivos}
        roleCanUse={roleCanUse}
      />

      {showChat && (
        <GameChat gameId={gameId} messages={chatMessages} onClose={handleCloseChat} />
      )}

      {rolesActivos && (
        <RoleOverlay
          open={showRolePanel}
          onClose={() => setShowRolePanel(false)}
          role={playerRole}
          isRevealed={roleRevealed}
          gameId={gameId}
          isPlayerTurn={isMyTurn}
          players={opponents}
          myCards={myCards}
          onRoleUsed={() => getPlayerRole(gameId).then(setPlayerRole).catch(() => {})}
        />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} mode={mode} customFlags={customFlags} isPublic={isPublic} />}

      {colorPickerState && (
        <ColorPicker
          mode={colorPickerState.mode}
          title={
            colorPickerState.mode === 'cancel'
              ? "Elige el color a bloquear"
              : "Elige un color"
          }
          description={
            colorPickerState.mode === 'cancel'
              ? "El siguiente jugador no podrá jugar este color"
              : "El siguiente jugador deberá jugar este color"
          }
          onSelect={(color) => closeColorPicker(color)}
          onCancel={() => closeColorPicker(null)}
        />
      )}

      <AnimatePresence>
        {pauseVoteBanner && (
          <PauseVoteBanner
            requestedBy={pauseVoteBanner.requestedBy}
            voters={pauseVoters}
            totalNeeded={totalNeeded}
            onVoteYes={handleVoteYesPause}
            onVoteNo={handleVoteNoPause}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaused && !resumeWaiting && (
          <PauseScreen
            gameId={gameId}
            totalVotes={totalNeeded}
            onRequestResume={handleRequestResume}
            onGoHome={handleGoHome}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaused && resumeWaiting && (
          <ResumeWaitingScreen
            hasVoted={hasVotedResume.current}
            onVote={handleRequestResume}
            resumeVotes={resumeVotes}
            totalNeeded={totalNeeded}
            voters={resumeVoters}
            onGoHome={handleGoHome}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameOver && (
          <GameOverScreen
            data={gameOver}
            players={allPlayers}
            currentUserId={myId}
            onClose={() => setGameOver(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Game;