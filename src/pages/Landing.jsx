import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { playSound } from "../utils/sounds";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/start");
  };

  return (
    <div className="landing-container">
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="logo-behind"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <img src="/img/logo.png" alt="background logo" />
        </motion.div>

        <div className="border"></div>

        <div className="content">
          <div className="logo">
            <motion.div
              className="logo1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            >
              <img
                src="/img/NOT.svg"
                alt="logo"
                className="logo-main"
                style={{ height: "32px", width: "auto" }}
              />
            </motion.div>

            <motion.div
              className="logo2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.5, ease: "easeOut" }}
            >
              <img
                src="/img/UNO.svg"
                alt="logo"
                className="logo-main"
                style={{ height: "32px", width: "auto" }}
              />
            </motion.div>

            <span className="trail"></span>
          </div>
        </div>

        <motion.span
          className="bottom-text"
          onClick={handleStart}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05, letterSpacing: "3px" }}
          whileTap={{ scale: 0.96 }}
        >
          CLICK TO PLAY
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Landing;