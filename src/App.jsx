import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Start from "./pages/Start";
import LoadingPage from "./pages/LoadingPage";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Friends from "./pages/Friends";

const App = () => (
  <Router>
    <Toaster 
      position="top-right" 
      richColors 
      closeButton
    />

    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/friends" element={<Friends />} />
    </Routes>
  </Router>
);

export default App;