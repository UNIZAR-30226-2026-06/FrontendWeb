import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/GameBoard.css";
import Card from "./Card";

const FlyingCard = ({ card, cardStyle, originRef, centerRef, onComplete }) => {
  const [done, setDone] = useState(false);
  const getOffset = () => {
    if (!originRef.current || !centerRef.current) return { x: 0, y: -200 };
    const from = originRef.current.getBoundingClientRect();
    const to   = centerRef.current.getBoundingClientRect();
    return {
      x: (to.left + to.width  / 2) - (from.left + from.width  / 2),
      y: (to.top  + to.height / 2) - (from.top  + from.height / 2),
    };
  };
  const offset = getOffset();
  if (done) return null;

  return (
    <motion.div style={{ position: "fixed", top: originRef.current?.getBoundingClientRect().top ?? 0, left: originRef.current?.getBoundingClientRect().left ?? 0, width: originRef.current?.getBoundingClientRect().width ?? 80, zIndex: 9999, pointerEvents: "none" }} initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }} animate={{ x: offset.x, y: offset.y, scale: 1.15, rotate: [0, -8, 6, 0], opacity: [1, 1, 1, 0] }} transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }} onAnimationComplete={() => { setDone(true); onComplete?.(); }}>
      <Card value={card.value} color={card.color} style={cardStyle} />
    </motion.div>
  );
};

const normalizeAvatar = (img) => { if (!img) return null; if (img.startsWith("/") || img.startsWith("http")) return img; if (img.includes(".")) return `/img/${img}`; return img; }; 

const GameBoard = ({ myCards = [], currentTableCard, opponents = [], cardStyle = "basic", onPlayCard, onDrawCard, isMyTurn = false, thinkingBotId = null, currentTurnId = null, myAvatar = null, currentUserId = null, turnSecondsLeft = null }) => {
  const centerRef = useRef(null);
  const [flyingCard, setFlyingCard] = useState(null);
  const cardRefs = useRef({});

  const RenderOpponent = ({ player, pos }) => {
    const name = player.nombre_usuario || player.nombre || player.id || "Jugador";
    const rawCards = player.hand || player.mano || 0;
    const cardsCount = Array.isArray(rawCards) ? rawCards.length : rawCards;
    const visualCards = Math.min(cardsCount, 8);

    const playerId = player.id || player.nombre_usuario;
    const isThinking = !!thinkingBotId && playerId === thinkingBotId;
    const isCurrent = !!currentTurnId && playerId === currentTurnId;

    const rawAvatarImg = player.avatarImage ?? (!player.isBot && playerId === currentUserId ? myAvatar : null);
    const avatarUrl = normalizeAvatar(rawAvatarImg);

    return (
      <div className={`opponent-container ${pos} ${isCurrent ? "is-current-turn" : ""} ${isThinking ? "is-thinking" : ""}`}>
        <div className="avatar-capsule">
          <div className="avatar-glow">
            {player.isBot
              ? "🤖"
              : avatarUrl && (avatarUrl.startsWith('/') || avatarUrl.startsWith('http'))
                ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : avatarUrl
                  ? <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{avatarUrl}</span>
                  : "👤"
            }
          </div>
          <div className="avatar-tag">
            <span className="bot-name">{name}</span>
            <span className="card-count-badge">{cardsCount}</span>
          </div>
          {isThinking && (
            <div className="thinking-indicator" aria-label={`${name} está pensando`}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>
        <div className={`bot-cards-fan fan-${pos}`}>
          {[...Array(visualCards)].map((_, i) => {
            const mid = (visualCards - 1) / 2;
            const rotateDegree = (i - mid) * 12;
            return (
              <div key={i} className={`bot-card-item card-back-${cardStyle}`} style={{ zIndex: i, transform: `rotate(${rotateDegree}deg)`, marginLeft: pos === "top" && i !== 0 ? "-35px" : "0", marginTop: (pos === "left" || pos === "right") && i !== 0 ? "-60px" : "0" }}>
                <div className="back-inner">UNO</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getPosition = (index, total) => {
    if (total === 1) return "top";
    if (total === 2) return index === 0 ? "left" : "right";
    const positions = ["left", "top", "right"];
    return positions[index % 3];
  };

  const formatCard = (card) => {
    if (!card) return null;
    if (typeof card === "string" && card.includes("_")) {
      const [color, value] = card.split("_");
      return { color, value };
    }
    return card;
  };

  const topCard = formatCard(currentTableCard);

  const WILD_VALUES = new Set([
    'wild', '+4', '+4R', '+1',
    'swapHands', 'discardHandRedraw', 'restartGame',
    'specialOnly', 'changeColor', 'cancelColor',
  ]);

  const ROLE_CARDS = new Set(['changeRole', 'addRoleUse']);

  const handlePlayCard = async (cardId, index) => {
    if (!onPlayCard) return;
    const card = formatCard(myCards[index]);
    const originRef = { current: cardRefs.current[index] };

    if (ROLE_CARDS.has(card.value)) {
      await onPlayCard(cardId);
      return;
    }

    const needsColor = WILD_VALUES.has(card.value) || card.color === 'black';
    if (needsColor) {
      const result = await onPlayCard(cardId, { card });
      if (!result || result.cancelled) return;
      setFlyingCard({ card, originRef });
      return;
    }

    setFlyingCard({ card, originRef });
    setTimeout(() => onPlayCard(cardId), 300);
  };

  return (
    <div className={`game-board-layout style-${cardStyle}`}>

      {flyingCard && (
        <FlyingCard
          card={flyingCard.card}
          cardStyle={cardStyle}
          originRef={flyingCard.originRef}
          centerRef={centerRef}
          onComplete={() => setFlyingCard(null)}
        />
      )}

      {opponents.map((opp, index) => (
        <RenderOpponent
          key={opp.id || index}
          player={opp}
          pos={getPosition(index, opponents.length)}
        />
      ))}

      <div className="board-center" ref={centerRef}>
        <div className="draw-pile" onClick={onDrawCard}>
          <div className={`card-back-${cardStyle} draw-stack`}>
            <div className="back-inner">UNO</div>
          </div>
        </div>

        <div className="active-card-area">
          <AnimatePresence mode="wait">
            {topCard ? (
              <motion.div
                key={`${topCard.color}-${topCard.value}-${topCard.chosenColor || ''}`}
                className="active-card-wrapper"
                initial={{ scale: 0.6, opacity: 0, rotateZ: -15 }}
                animate={{ scale: 1,   opacity: 1, rotateZ: 0   }}
                exit={{    scale: 0.8, opacity: 0, rotateZ: 10  }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Card
                  value={topCard.value}
                  color={topCard.color}
                  chosenColor={topCard.chosenColor}
                  style={cardStyle}
                />
                {topCard.chosenColor && (
                  <motion.div
                    className={`active-color-flag flag-${topCard.chosenColor}`}
                    initial={{ scale: 0, rotate: -30, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0,   opacity: 1 }}
                    exit={{    scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }}
                    aria-label={`Color en juego: ${topCard.chosenColor}`}
                  />
                )}
              </motion.div>
            ) : (
              <div className="empty-slot">🎴</div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="player-interaction-area">
        <div className="hand-and-arc-wrapper">
          {isMyTurn && turnSecondsLeft !== null && (
            <div className="turn-arc-wrapper">
              <svg
                className="turn-arc-svg"
                viewBox="0 0 420 70"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="arcGradNormal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#0097a7" />
                    <stop offset="50%"  stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#0097a7" />
                  </linearGradient>
                  <linearGradient id="arcGradWarning" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#e65100" />
                    <stop offset="50%"  stopColor="#ffd740" />
                    <stop offset="100%" stopColor="#e65100" />
                  </linearGradient>
                  <linearGradient id="arcGradUrgent" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#b71c1c" />
                    <stop offset="50%"  stopColor="#ff5252" />
                    <stop offset="100%" stopColor="#b71c1c" />
                  </linearGradient>
                  <filter id="arcGlow" x="-10%" y="-80%" width="120%" height="260%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                <path
                  d="M 15 50 Q 210 5 405 50"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  className={`arc-fill ${turnSecondsLeft <= 5 ? 'urgent' : turnSecondsLeft <= 10 ? 'warning' : ''}`}
                  d="M 15 50 Q 210 5 405 50"
                  fill="none"
                  stroke={turnSecondsLeft <= 5 ? "url(#arcGradUrgent)" : turnSecondsLeft <= 10 ? "url(#arcGradWarning)" : "url(#arcGradNormal)"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="445"
                  strokeDashoffset={445 - (445 * Math.min(1, turnSecondsLeft / 30))}
                  filter="url(#arcGlow)"
                  style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease" }}
                />

                <text
                  x="210" y="44"
                  textAnchor="middle"
                  className={`arc-seconds-text ${turnSecondsLeft <= 5 ? 'urgent' : turnSecondsLeft <= 10 ? 'warning' : ''}`}
                  fill={turnSecondsLeft <= 5 ? "#ff5252" : turnSecondsLeft <= 10 ? "#ffd740" : "#00e5ff"}
                >
                  {turnSecondsLeft <= 5 ? `¡${turnSecondsLeft}!` : `${turnSecondsLeft}s`}
                </text>
              </svg>
            </div>
          )}
          <motion.div
          className="my-hand-container fan-style"
          animate={
            isMyTurn
              ? {
                  y: [0, -5, 0],
                  filter: [
                    "drop-shadow(0 0 4px rgba(0,229,255,0.1))",
                    "drop-shadow(0 0 12px rgba(0,229,255,0.45))",
                    "drop-shadow(0 0 4px rgba(0,229,255,0.1))",
                  ],
                }
              : {
                  y: 0,
                  filter: "drop-shadow(0 0 0px rgba(0,229,255,0))",
                }
          }
          transition={
            isMyTurn
              ? {
                  y:      { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  filter: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }
              : {}
          }
        >
          {myCards.map((card, index) => {
            const c = formatCard(card);
            const cardId = card.id || card;
            const total = myCards.length;
            const mid = (total - 1) / 2;
            const rotate = (index - mid) * 5;
            const translateY = Math.abs(index - mid) * 4;

            return (
              <motion.div
                key={index}
                className="card-hover-wrapper"
                ref={(el) => (cardRefs.current[index] = el)}
                style={{ zIndex: index }}
                animate={{ rotate, translateY }}
                whileHover={{
                  translateY: -50,
                  scale: 1.15,
                  rotate: 0,
                  zIndex: 500,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlayCard(cardId, index)}
              >
                <Card value={c.value} color={c.color} style={cardStyle} />
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;