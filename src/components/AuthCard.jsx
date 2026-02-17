import React from "react";
import { useNavigate } from "react-router-dom"; // Importante para la navegación
import "../styles/AuthCard.css";

const AuthCard = () => {
  const navigate = useNavigate();

  // Función para manejar el "Acceso" temporal
  const handleAuth = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    navigate("/home");  // Te lleva a la pantalla que me acabas de mostrar
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>
          
          <div className="flip-card__inner">
            {/* Cara de Log In */}
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={handleAuth}>
                <input className="flip-card__input" placeholder="Email" type="email" required />
                <input className="flip-card__input" placeholder="Password" type="password" required />
                <button type="submit" className="flip-card__btn">Let's go!</button>
              </form>
            </div>

            {/* Cara de Sign Up */}
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleAuth}>
                <input className="flip-card__input" placeholder="Name" type="text" required />
                <input className="flip-card__input" placeholder="Email" type="email" required />
                <input className="flip-card__input" placeholder="Password" type="password" required />
                <button type="submit" className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AuthCard;