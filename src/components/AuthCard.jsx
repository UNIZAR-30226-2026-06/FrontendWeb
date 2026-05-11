import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { playSound } from "../utils/sounds";
import "../styles/AuthCard.css";
import "../styles/Profile.css";
import "../styles/SettingsModal.css";

import { registerUser, loginUser as loginApi, changePassword } from "../services/authService";

const AuthCard = () => {
  const navigate = useNavigate();

  const [loginName, setLoginName] = useState(""); 
  const [signupUser, setSignupUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetUser, setResetUser] = useState("");
  const [resetCurrentPw, setResetCurrentPw] = useState("");
  const [resetNewPw, setResetNewPw] = useState("");
  const [resetConfirmPw, setResetConfirmPw] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi(loginName, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.nombre_usuario);
      playSound("success");
      toast.success(`¡Bienvenido de nuevo, ${data.user.nombre_usuario}!`, {
        description: "Sesión iniciada correctamente.",
        icon: "🎮",
      });
      navigate("/loading");
    } catch (error) {
      playSound("error");
      toast.error("Error de acceso", { description: error.message });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      playSound("error");
      toast.error("¡Las contraseñas no coinciden!");
      return;
    }
    try {
      const data = await registerUser(signupUser, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.nombre_usuario);
      playSound("success");
      toast.success(`¡Cuenta creada, ${data.user.nombre_usuario}!`, {
        description: "Usuario registrado en la base de datos.",
        icon: "🚀",
      });
      navigate("/loading");
    } catch (error) {
      playSound("error");
      toast.error("Error al registrarse", { description: error.message });
    }
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    if (resetNewPw !== resetConfirmPw) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (resetNewPw.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setResetLoading(true);
    try {
      const loginData = await loginApi(resetUser, resetCurrentPw);
      const tempToken = loginData.token;

      const prevToken = localStorage.getItem("token");
      localStorage.setItem("token", tempToken);
      await changePassword(resetCurrentPw, resetNewPw);
      if (prevToken) localStorage.setItem("token", prevToken);
      else localStorage.removeItem("token");

      playSound("success");
      toast.success("Contraseña cambiada correctamente");
      setShowModal(false);
      setResetUser("");
      setResetCurrentPw("");
      setResetNewPw("");
      setResetConfirmPw("");
    } catch (error) {
      playSound("error");
      toast.error("Error", { description: error.message });
    } finally {
      setResetLoading(false);
    }
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
                <input className="flip-card__input" placeholder="UserName" type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} required />
                <input className="flip-card__input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <p className="forgot-password" onClick={() => setShowModal(true)}>
                  ¿Has olvidado tu contraseña?
                </p>
                <button type="submit" className="flip-card__btn">
                  Let's go!
                </button>
              </form>
            </div>

            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleSignUp}>
                <input className="flip-card__input" placeholder="UserName" type="text" value={signupUser} onChange={(e) => setSignupUser(e.target.value)} required />
                <input className="flip-card__input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="flip-card__input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input className="flip-card__input" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit" className="flip-card__btn">
                  Confirm!
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="edit-profile-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-x" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <h2 className="settings-title-green">CAMBIAR CONTRASEÑA</h2>

            <form className="edit-form" onSubmit={handleRecoverPassword}>
              <label className="edit-label">Usuario</label>
              <input className="edit-input" type="text" placeholder="Tu nombre de usuario" value={resetUser} onChange={(e) => setResetUser(e.target.value)} autoFocus required />
              <label className="edit-label">Contraseña actual</label>
              <input className="edit-input" type="password" placeholder="••••••••" value={resetCurrentPw} onChange={(e) => setResetCurrentPw(e.target.value)} required />
              <label className="edit-label">Nueva contraseña</label>
              <input className="edit-input" type="password" placeholder="••••••••" value={resetNewPw} onChange={(e) => setResetNewPw(e.target.value)} required />
              <label className="edit-label">Confirmar nueva contraseña</label>
              <input className="edit-input" type="password" placeholder="••••••••" value={resetConfirmPw} onChange={(e) => setResetConfirmPw(e.target.value)} required />
              <button type="submit" className="edit-save-btn" disabled={resetLoading}>
                {resetLoading ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthCard;