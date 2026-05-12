import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRole as apiUseRole } from "../services/roleService";
import { toast } from "sonner";
import Card from "./Card";
import "../styles/RoleActionPanel.css";

const COLORS = [
  { id: "red", label: "Rojo", hex: "#D72600" },
  { id: "blue", label: "Azul", hex: "#0956BF" },
  { id: "green", label: "Verde", hex: "#379711" },
  { id: "yellow", label: "Amarillo", hex: "#ECD407" },
];

const NUMBERS = ["0","1","2","3","4","5","6","7","8","9"];

const SPECIAL_VALUES = new Set([
  '+2','reverse','+2R','skip','extraTurn',
  'playOdd','playEven','wild','+4','draw1All',
]);

function getRoleKey(roleName = "") {
  const n = roleName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (n === "espia") return "espia";
  if (n === "ladron") return "ladron";
  if (n === "anular cartas") return "anular_cartas";
  if (n === "transformar carta") return "transformar_carta";
  if (n === "mirar la siguiente carta del mazo") return "mirar_siguiente_carta";
  if (n === "bloquear habilidades") return "bloquear_habilidades";
  return null;
}

function formatCard(card) {
  if (!card) return null;
  if (typeof card === "string" && card.includes("_")) {
    const [color, value] = card.split("_");
    return { color, value };
  }
  return card;
}

const SpyResultOverlay = ({ hand, targetName, onClose }) => (
  <motion.div className="rap-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div
      className="rap-result-panel"
      initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
      onClick={e => e.stopPropagation()}
    >
      <h3 className="rap-result-title">🕵️ Mano de <span>{targetName}</span></h3>
      <div className="rap-spy-hand">
        {hand.map((card, i) => {
          const c = formatCard(card);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card value={c?.value} color={c?.color ?? "blue"} style="basic" />
            </motion.div>
          );
        })}
        {hand.length === 0 && <p className="rap-empty">No tiene cartas</p>}
      </div>
      <button className="rap-close-btn" onClick={onClose}>Cerrar</button>
    </motion.div>
  </motion.div>
);

const PeekResultOverlay = ({ card, onClose }) => {
  const c = formatCard(card);
  return (
    <motion.div className="rap-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="rap-result-panel rap-peek"
        initial={{ scale: 0.7, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="rap-result-title">🔮 Siguiente carta del mazo</h3>
        {c
          ? <div className="rap-peek-card"><Card value={c.value} color={c.color ?? "blue"} style="basic" /></div>
          : <p className="rap-empty">El mazo está vacío</p>
        }
        <button className="rap-close-btn" onClick={onClose}>Cerrar</button>
      </motion.div>
    </motion.div>
  );
};

const PlayerSelector = ({ players, selectedId, onSelect, label }) => (
  <div className="rap-section">
    <p className="rap-label">{label}</p>
    <div className="rap-player-list">
      {players.map(p => (
        <motion.button
          key={p.id}
          className={`rap-player-btn ${selectedId === p.id ? "selected" : ""}`}
          onClick={() => onSelect(p.id)}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <span className="rap-player-avatar">{(p.id || p.nombre_usuario || "?")[0].toUpperCase()}</span>
          <span>{p.id || p.nombre_usuario}</span>
        </motion.button>
      ))}
    </div>
  </div>
);

const MyCardSelector = ({ cards, selectedId, onSelect, label }) => (
  <div className="rap-section">
    <p className="rap-label">{label}</p>
    <div className="rap-card-list">
      {cards.map((card, i) => {
        const c  = formatCard(card);
        const id = card.id || card;
        const isSel = selectedId === id;
        return (
          <motion.div
            key={i}
            className={`rap-card-option ${isSel ? "selected" : ""}`}
            onClick={() => onSelect(id)}
            whileHover={{ y: -8, scale: 1.08 }} whileTap={{ scale: 0.95 }}
            animate={isSel ? { y: -12 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <Card value={c?.value} color={c?.color ?? "blue"} style="basic" />
          </motion.div>
        );
      })}
    </div>
  </div>
);


const RoleActionPanel = ({ role, gameId, isPlayerTurn, players = [], myCards = [], onRoleUsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [ownCardId, setOwnCardId] = useState(null);
  const [newColor, setNewColor] = useState(null);
  const [newNumber, setNewNumber] = useState(null);
  const [spyResult, setSpyResult] = useState(null);
  const [peekResult, setPeekResult] = useState(null);

  if (!role) return null;

  const maxUses = role.maxUses ?? 0;
  const uses = role.uses ?? 0;
  const remainingUses = Math.max(maxUses - uses, 0);
  const canUse = role.canUseNow && isPlayerTurn && remainingUses > 0;
  const roleKey = getRoleKey(role.role?.name || "");
  const needsPanel = ["espia","ladron","anular_cartas","transformar_carta"].includes(roleKey);

  const resetState = () => { setTargetId(null); setOwnCardId(null); setNewColor(null); setNewNumber(null); setIsOpen(false); };

  const validate = () => {
    if (roleKey === "espia" && !targetId) return "Selecciona un jugador para espiar";
    if (roleKey === "ladron" && !targetId) return "Selecciona un jugador objetivo";
    if (roleKey === "ladron" && !ownCardId) return "Selecciona una carta tuya para intercambiar";
    if (roleKey === "anular_cartas" && !ownCardId) return "Selecciona una carta para descartar";
    if (roleKey === "transformar_carta"&& !ownCardId) return "Selecciona una carta para transformar";
    if (roleKey === "transformar_carta"&& !newColor && !newNumber) return "Elige un nuevo color o número";
    return null;
  };

  const handleMainClick = async () => {
    if (!canUse || isLoading) return;
    if (needsPanel) { setIsOpen(v => !v); return; }

    setIsLoading(true);
    try {
      const res = await apiUseRole(gameId, {});
      if (roleKey === "mirar_siguiente_carta") setPeekResult(res.result?.nextCard ?? null);
      else toast.success("🚫 Habilidades bloqueadas para esta ronda");
      onRoleUsed?.();
    } catch (e) {
      toast.error(e?.message || "Error al usar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    setIsLoading(true);
    try {
      const payload = {
        targetPlayerId: targetId  ?? undefined,
        ownCardId: ownCardId ?? undefined,
        cardId: ownCardId ?? undefined,
        newColor: newColor  ?? undefined,
        newNumber: newNumber !== null ? Number(newNumber) : undefined,
      };
      const res = await apiUseRole(gameId, payload);

      if (roleKey === "espia" && res.result?.targetHand) {
        setSpyResult({ hand: res.result.targetHand, targetName: targetId });
      }
      toast.success("✅ Rol usado con éxito");
      onRoleUsed?.();
      resetState();
    } catch (e) {
      toast.error(e?.message || "Error al usar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  const numericCards = myCards.filter(card => !SPECIAL_VALUES.has(formatCard(card)?.value));

  const renderPanelContent = () => {
    switch (roleKey) {
      case "espia":
        return <PlayerSelector players={players} selectedId={targetId} onSelect={setTargetId} label="🕵️ ¿A quién quieres espiar?" />;

      case "ladron":
        return <>
          <PlayerSelector players={players} selectedId={targetId} onSelect={setTargetId} label="🦹 ¿A quién quieres robar?" />
          <MyCardSelector cards={myCards} selectedId={ownCardId} onSelect={setOwnCardId} label="🃏 ¿Qué carta das a cambio?" />
        </>;

      case "anular_cartas":
        return <MyCardSelector cards={myCards} selectedId={ownCardId} onSelect={setOwnCardId} label="🗑️ ¿Qué carta quieres descartar?" />;

      case "transformar_carta":
        return <>
          <MyCardSelector cards={numericCards} selectedId={ownCardId} onSelect={setOwnCardId} label="✨ ¿Qué carta transformas? (solo numéricas)" />
          <div className="rap-section">
            <p className="rap-label">🎨 Nuevo color (opcional)</p>
            <div className="rap-color-grid">
              {COLORS.map(col => (
                <motion.button
                  key={col.id}
                  className={`rap-color-btn ${newColor === col.id ? "selected" : ""}`}
                  style={{ "--col": col.hex }}
                  onClick={() => setNewColor(newColor === col.id ? null : col.id)}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >{col.label}</motion.button>
              ))}
            </div>
          </div>
          <div className="rap-section">
            <p className="rap-label">🔢 Nuevo número (opcional)</p>
            <div className="rap-number-grid">
              {NUMBERS.map(num => (
                <motion.button
                  key={num}
                  className={`rap-number-btn ${newNumber === num ? "selected" : ""}`}
                  onClick={() => setNewNumber(newNumber === num ? null : num)}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >{num}</motion.button>
              ))}
            </div>
          </div>
        </>;

      default: return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {spyResult  && <SpyResultOverlay hand={spyResult.hand} targetName={spyResult.targetName} onClose={() => setSpyResult(null)} />}
        {peekResult !== null && <PeekResultOverlay card={peekResult} onClose={() => setPeekResult(null)} />}
      </AnimatePresence>

      <motion.div
        className="rap-wrapper"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0,  scale: 1   }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
      >
        <motion.button
          className={`rap-main-btn ${canUse ? "active" : "disabled"} ${isOpen ? "open" : ""}`}
          onClick={handleMainClick}
          disabled={!canUse || isLoading}
          whileHover={canUse ? { scale: 1.05, y: -2 } : {}}
          whileTap={canUse ? { scale: 0.95 } : {}}
          animate={canUse ? { boxShadow: ["0 0 0px rgba(0,229,255,0)","0 0 20px rgba(0,229,255,0.5)","0 0 0px rgba(0,229,255,0)"] } : {}}
          transition={canUse ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          <span className="rap-btn-text">
            {isLoading ? "Usando..." : (needsPanel && isOpen ? "Cancelar" : "Usar Rol")}
          </span>
          <span className="rap-btn-uses">{remainingUses}/{maxUses}</span>
          {needsPanel && canUse && (
            <motion.span className="rap-btn-arrow" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>▲</motion.span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && needsPanel && (
            <motion.div
              className="rap-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="rap-panel-inner">
                <div className="rap-role-header">
                  <span className="rap-role-name">{role.role?.name}</span>
                </div>
                {renderPanelContent()}
                <motion.button
                  className="rap-confirm-btn"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? "Ejecutando..." : "✅ Confirmar"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default RoleActionPanel;