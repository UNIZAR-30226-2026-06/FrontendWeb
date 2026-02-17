import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthCard.css";

const AuthCard = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false); 
  
  const handleAuth = (e) => {
    e.preventDefault();
    navigate("/loading");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("¡Las contraseñas no coinciden!");
      return;
    }
    navigate("/loading");
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    alert("Correo de recuperación enviado");
    setShowModal(false);
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>
          
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={handleAuth}>
                <input className="flip-card__input" placeholder="UserName" type="text" required />
                <input className="flip-card__input" placeholder="Password" type="password" required />
                
                <p className="forgot-password" onClick={() => setShowModal(true)}>
                  ¿Has olvidado tu contraseña?
                </p>

                <button type="submit" className="flip-card__btn">Let's go!</button>
              </form>
            </div>

            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleSignUp}>
                <input className="flip-card__input" placeholder="UserName" type="text" required />
                <input className="flip-card__input" placeholder="Email" type="email" required />
                <input 
                  className="flip-card__input" 
                  placeholder="Password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <input 
                  className="flip-card__input" 
                  placeholder="ConfirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
                <button type="submit" className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="title">RECUPERAR</div>
            
            <p className="modal-text">
              Introduce tu correo para enviarte una nueva contraseña.
            </p>
            
            <form className="flip-card__form" onSubmit={handleRecoverPassword}>
              <input className="flip-card__input" placeholder="Email" type="email" required />
              <div className="modal-buttons">
                <button type="submit" className="flip-card__btn">Enviar</button>
                <button type="button" className="flip-card__btn cancel" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthCard;