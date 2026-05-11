import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';

import Landing from "./pages/Landing";
import Start from "./pages/Start";
import LoadingPage from "./pages/LoadingPage";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Friends from "./pages/Friends";
import PrivateAction from "./pages/PrivateActionSelector";
import ConnectionSelector from "./pages/ConnectionSelector";
import ModeCards from "./pages/ModeCards";
import ModeRols from "./pages/ModeRols";
import JoinPartySelector from "./pages/JoinPartySelector";
import PartidaPersonalizada from "./pages/PartidaPersonalizada";
import CustomJoin from "./pages/CustomJoin";
import PartidasPausadas from "./pages/PartidasPausadas";
import Lobby from "./pages/Lobby";

import CardGallery from "./pages/CardGallery";
import GameBoard from "./components/GameBoard";

const App = () => { 
  const audioRef = useRef(new Audio("/sounds/base.mp3"));

  /*useEffect(() => {
    const music = audioRef.current;
    music.loop = true; 
    music.volume = 0.03; 

    const startMusic = () => {
      music.play().catch((err) => {
        console.log("El navegador bloqueó el autoplay. Sonará tras el primer clic.");
      });
      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);
    return () => {
      window.removeEventListener("click", startMusic);
    };
  }, []);*/

  return (
    <Router>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<Start />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<Home />} />

        <Route path="/game" element={<Game />} /> 
        <Route path="/partidasPausadas" element={<PartidasPausadas />} />
        <Route path="/galeria" element={<CardGallery />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/friends" element={<Friends />} />

        <Route path="/private-action" element={<PrivateAction />} />
        <Route path="/container" element={<ConnectionSelector />} />
        <Route path="/modeCards" element={<ModeCards />} />
        <Route path="/modeRols" element={<ModeRols />} />
        <Route path="/code" element={<JoinPartySelector />} />
        <Route path="/partidaPersonalizada" element={<PartidaPersonalizada />} />
        <Route path="/customJoin" element={<CustomJoin />} />
        <Route path="/lobby" element={<Lobby />} />

        <Route path="/gameBoard" element={<GameBoard />} />
      </Routes>
    </Router>
  ); 
}; 

export default App;
