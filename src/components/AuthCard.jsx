import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { playSound } from "../utils/sounds";
import "../styles/AuthCard.css";

import { registerUser, loginUser as loginApi } from "../services/authService";

const AuthCard = () => {
  const navigate = useNavigate();

  const [loginName, setLoginName] = useState(""); 
  const [signupUser, setSignupUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      const data = await loginApi(loginName, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.nombre_usuario);

      playSound('success');
      toast.success(`¡Bienvenido de nuevo, ${data.user.nombre_usuario}!`, {
        description: "Sesión iniciada correctamente.",
        icon: "🎮"
      });

      navigate("/loading");
    } catch (error) {
      playSound('error');
      toast.error("Error de acceso", {
        description: error.message, 
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      playSound('error');
      toast.error("¡Las contraseñas no coinciden!");
      return;
    }

    try {
      const data = await registerUser(signupUser, email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.nombre_usuario);

      playSound('success');
      toast.success(`¡Cuenta creada, ${data.user.nombre_usuario}!`, {
        description: "Usuario registrado en la base de datos.",
        icon: "🚀"
      });

      navigate("/loading");
    } catch (error) {
      playSound('error');
      toast.error("Error al registrarse", {
        description: error.message,
      });
    }
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    playSound('success');
    toast.success("Correo enviado", {
      description: `Hemos enviado instrucciones a ${email}`,
      icon: "📧"
    });
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
                <input 
                  className="flip-card__input" 
                  placeholder="UserName" 
                  type="text" 
                  value={loginName} 
                  onChange={(e) => setLoginName(e.target.value)} 
                  required 
                />
                <input 
                  className="flip-card__input" 
                  placeholder="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />

                <p className="forgot-password" onClick={() => setShowModal(true)}>
                  ¿Has olvidado tu contraseña?
                </p>

                <button type="submit" className="flip-card__btn">Let's go!</button>
              </form>
            </div>

            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleSignUp}>
                <input 
                  className="flip-card__input" 
                  placeholder="UserName" 
                  type="text" 
                  value={signupUser} 
                  onChange={(e) => setSignupUser(e.target.value)} 
                  required 
                />
                <input 
                  className="flip-card__input" 
                  placeholder="Email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
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
                  placeholder="Confirm Password" 
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
              <input 
                className="flip-card__input" 
                placeholder="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
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