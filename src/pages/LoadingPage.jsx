import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { playSound } from "../utils/sounds";
import "../styles/Start.css";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    playSound('transition');

    const isStartingGame = location.state?.players || location.state?.mode;

    const timer = setTimeout(() => {
      if (isStartingGame) {
        navigate("/gameBoard", { state: location.state });
      } else {
        navigate("/home");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="start-screen">
       <Loader />
    </div>
  );
};

export default LoadingPage;