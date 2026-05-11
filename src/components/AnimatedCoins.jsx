import React, { useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";

const AnimatedCoins = ({ coins, className = "", delay = 0 }) => {
  const nodeRef = useRef(null);
  const prevCoins = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!nodeRef.current) return;

      const isFirstRender = prevCoins.current === null;
      const from = isFirstRender ? 0 : prevCoins.current;
      const to = coins;
      prevCoins.current = coins;

      if (from === to) {
        nodeRef.current.textContent = `💰 ${to} Monedas`;
        return;
      }

      const timeout = setTimeout(() => {
        const controls = animate(from, to, {
          duration: 1.2,
          ease: "easeOut",
          onUpdate: (value) => {
            if (nodeRef.current) {
              nodeRef.current.textContent = `💰 ${Math.round(value)} Monedas`;
            }
          },
        });
        return () => controls.stop();
      }, isFirstRender ? 0 : delay);

      return () => clearTimeout(timeout);
    });

    return () => cancelAnimationFrame(raf);
  }, [coins]);

  return (
    <motion.div className={className}>
      <span ref={nodeRef}>💰 {coins} Monedas</span>
    </motion.div>
  );
};

export default AnimatedCoins;
