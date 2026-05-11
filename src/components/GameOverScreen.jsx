import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import "../styles/GameOverScreen.css";

const CONFETTI_COLORS = ["#62b155","#00e5ff","#ECD407","#D72600","#ffffff","#a78bfa"];

function useConfetti(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 140 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * -canvas.height,
      w:  6 + Math.random() * 10,
      h:  10 + Math.random() * 16,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * 360,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      vr: (Math.random() - 0.5) * 6,
      opacity: 0.8 + Math.random() * 0.2,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.vr;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, canvasRef]);
}

function AnimatedCoins({ target, duration = 1800, delay = 0 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts + delay;
      const elapsed = Math.max(0, ts - start);
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return <>{val.toLocaleString()}</>;
}

const PlayerResultCard = ({ player, index, isWinner, isMe, coinsEarned }) => (
  <motion.div
    className={`gor-player-card ${isWinner ? "winner" : ""} ${isMe ? "is-me" : ""}`}
    initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.85 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.4 + index * 0.1 }}
  >
    <div className="gor-player-avatar">
      {isWinner ? "🏆" : (player.id || player.nombre_usuario || "?")[0].toUpperCase()}
    </div>
    <div className="gor-player-info">
      <span className="gor-player-name">
        {player.id || player.nombre_usuario}
        {isMe && <span className="gor-you-badge">TÚ</span>}
      </span>
      <span className="gor-player-role">
        {player.isBot ? "🤖 Bot" : (isWinner ? "🥇 Ganador" : "Participante")}
      </span>
    </div>
    <div className="gor-coins-earned">
      <span className="gor-coin-icon">🪙</span>
      <span className="gor-coin-amount">
        +<AnimatedCoins target={coinsEarned} delay={600 + index * 100} />
      </span>
    </div>
  </motion.div>
);

const GameOverScreen = ({ data, players = [], currentUserId, onClose }) => {
  const navigate    = useNavigate();
  const canvasRef   = useRef(null);
  const [coinsAdded, setCoinsAdded] = useState(false);
  const [myNewTotal, setMyNewTotal] = useState(null);

  const isWinner   = data.winner === currentUserId;
  const isBot      = data.isBot;
  const winnerCoins = data.recompensa || 50;
  const loserCoins  = 10;

  useConfetti(canvasRef, isWinner);

  useEffect(() => {
    if (coinsAdded) return;
    setCoinsAdded(true);

    const amount = isWinner ? winnerCoins : loserCoins;

    if (!isBot || isWinner) {
      apiRequest("/wallet/add", "POST", { amount })
        .then(res => { if (res?.coins != null) setMyNewTotal(res.coins); })
        .catch(() => {});
    }
  }, []);

  const handleGoHome = () => navigate("/home");

  const getCoinsForPlayer = (p) => {
    const id = p.id || p.nombre_usuario;
    if (id === data.winner && !p.isBot) return winnerCoins;
    if (!p.isBot)                       return loserCoins;
    return 0;
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if ((a.id || a.nombre_usuario) === data.winner) return -1;
    if ((b.id || b.nombre_usuario) === data.winner) return  1;
    return 0;
  });

  return (
    <motion.div
      className="gor-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isWinner && <canvas ref={canvasRef} className="gor-confetti-canvas" />}

      <div className="gor-bg-particles">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="gor-particle"
            style={{
              left: `${8 + i * 8}%`,
              width:  `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div
        className="gor-panel"
        initial={{ scale: 0.7, opacity: 0, y: 60 }}
        animate={{ scale: 1,   opacity: 1, y: 0  }}
        exit={{    scale: 0.8, opacity: 0, y: 40  }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.1 }}
      >

        <div className="gor-header">
          <motion.div
            className="gor-trophy"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate:   0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 }}
          >
            {isWinner ? "🏆" : "🎮"}
          </motion.div>

          <motion.h1
            className={`gor-title ${isWinner ? "winner-title" : "loser-title"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y:   0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {isWinner ? "¡Victoria!" : "¡Fin de partida!"}
          </motion.h1>

          <motion.p
            className="gor-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isWinner
              ? "¡Has ganado la partida! 🎉"
              : `${data.winner} se ha llevado la victoria`}
          </motion.p>
        </div>

        <motion.div
          className={`gor-reward-box ${isWinner ? "reward-gold" : "reward-silver"}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1   }}
          transition={{ delay: 0.65, type: "spring", stiffness: 260, damping: 22 }}
        >
          <span className="gor-reward-label">
            {isWinner ? "🥇 Recompensa de victoria" : "🎖️ Monedas por participar"}
          </span>
          <div className="gor-reward-amount">
            <span className="gor-coin-big">🪙</span>
            <span className="gor-reward-num">
              +<AnimatedCoins target={isWinner ? winnerCoins : loserCoins} duration={1400} delay={700} />
            </span>
          </div>
          {myNewTotal != null && (
            <motion.span
              className="gor-total-coins"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              Total: <AnimatedCoins target={myNewTotal} duration={800} delay={2400} /> 🪙
            </motion.span>
          )}
        </motion.div>

        <div className="gor-players-list">
          {sortedPlayers.map((p, i) => {
            const pid = p.id || p.nombre_usuario;
            return (
              <PlayerResultCard
                key={pid || i}
                player={p}
                index={i}
                isWinner={pid === data.winner}
                isMe={pid === currentUserId}
                coinsEarned={getCoinsForPlayer(p)}
              />
            );
          })}
        </div>

        <motion.div
          className="gor-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            className="gor-btn gor-btn-primary"
            onClick={handleGoHome}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            🏠 Volver al inicio
          </motion.button>
          <motion.button
            className="gor-btn gor-btn-secondary"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver tablero
          </motion.button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;