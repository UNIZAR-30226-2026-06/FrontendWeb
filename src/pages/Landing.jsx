import React from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/start"); 
  };

  return (
    <div className="landing-container">
      <div className="card">
        <div className="logo-behind">
            <img src="/img/logo.png" alt="background logo" />
        </div>
        <div className="border"></div>
        <div className="content">
          <div className="logo">
            <div className="logo1">
                <img 
                src="/img/NOT.svg" 
                alt="logo" 
                className="logo-main" 
                style={{ height: '32px', width: 'auto' }} 
                />
            </div>
            <div className="logo2">
                <img 
                src="/img/UNO.svg" 
                alt="logo" 
                className="logo-main" 
                style={{ height: '32px', width: 'auto' }} 
                />
            </div>
            <span className="trail"></span>
            </div>
        </div>
        <span className="bottom-text"  onClick={handleStart}>CLICK TO PLAY</span>
      </div>
    </div>
  );
};

export default Landing;