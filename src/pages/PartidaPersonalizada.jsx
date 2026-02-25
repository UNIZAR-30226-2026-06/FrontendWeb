import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../utils/sounds";
import CustomGameSelector from "../components/CustomGameSelector";

const PartidaPersonalizada = () => {
  const navigate = useNavigate();

  const handleCreateGame = (config) => {
    console.log("Configuración de partida recibida:", config);
    
    navigate("/loading", { 
      state: { 
        ...config,
        type: 'custom_multiplayer' 
      } 
    });
  };

  return (
    <div className="page-wrapper">
      <CustomGameSelector onStart={handleCreateGame} />
    </div>
  );
};

export default PartidaPersonalizada;