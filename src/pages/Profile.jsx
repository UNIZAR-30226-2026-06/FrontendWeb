import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileBox from "../components/ProfileBox";
import AvatarItem from "../components/AvatarItem";
import CardDesignItem from "../components/CardDesignItem";
import AnimatedCoins from "../components/AnimatedCoins";
import {
  getMyProfile,
  getMyBoughtAvatars,
  getMyBoughtStyles,
  updateActiveAvatar,
  updateActiveStyle,
  getFriendsCount,
  updateBasicProfile,
} from "../services/userService";
import { changePassword } from "../services/authService";
import "../styles/Profile.css";

const normalizeImage = (img) => {
  if (!img) return null;
  if (img.startsWith("/") || img.startsWith("http")) return img;
  if (img.includes(".")) return `/img/${img}`;
  return null;
};

const Profile = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [user, setUser] = useState(null);
  const [myAvatars, setMyAvatars] = useState([]);
  const [myStyles, setMyStyles] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState("correo");
  const [editCorreo, setEditCorreo] = useState("");
  const [editPwActual, setEditPwActual] = useState("");
  const [editPwNueva, setEditPwNueva] = useState("");
  const [editPwConfirm, setEditPwConfirm] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, avatarsData, stylesData, countData] = await Promise.all([
          getMyProfile(),
          getMyBoughtAvatars(),
          getMyBoughtStyles(),
          getFriendsCount(),
        ]);

        const currentAvatarId = Number(profileData.avatar);
        const currentStyleId = Number(profileData.estilo);
        const activeAvatar = avatarsData.find(av => Number(av.id_avatar) === currentAvatarId);

        setUser({
          ...profileData,
          id_avatar_seleccionado: currentAvatarId,
          id_estilo_seleccionado: currentStyleId,
          imagen_avatar: activeAvatar ? activeAvatar.image : "👤",
        });
        setMyAvatars(avatarsData);
        setMyStyles(stylesData);
        setFriendsCount(
          typeof countData === "object" ? (countData.count || countData.total || 0) : countData
        );
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleSelectAvatar = async (avatarId) => {
    try {
      await updateActiveAvatar(avatarId);
      const newAvatar = myAvatars.find(a => Number(a.id_avatar) === Number(avatarId));
      setUser(prev => ({
        ...prev,
        imagen_avatar: newAvatar?.image || prev.imagen_avatar,
        id_avatar_seleccionado: Number(avatarId),
      }));
      if (newAvatar?.image) localStorage.setItem("userAvatar", newAvatar.image);
      toast.success("Avatar actualizado");
    } catch {
      toast.error("No se pudo cambiar el avatar");
    }
  };

  const handleSelectStyle = async (styleId) => {
    try {
      await updateActiveStyle(styleId);
      const newStyle = myStyles.find(s => Number(s.id_estilo) === Number(styleId));
      setUser(prev => ({ ...prev, id_estilo_seleccionado: Number(styleId) }));
      if (newStyle) localStorage.setItem("cardDesign", newStyle.nombre);
      toast.success("Diseño de cartas actualizado");
    } catch {
      toast.error("No se pudo cambiar el diseño");
    }
  };

  const openEdit = () => {
    setEditCorreo(user?.correo || "");
    setEditPwActual("");
    setEditPwNueva("");
    setEditPwConfirm("");
    setEditTab("correo");
    setShowEditModal(true);
  };

  const handleSaveCorreo = async () => {
    if (!editCorreo.trim()) { toast.error("El correo no puede estar vacío"); return; }
    setEditLoading(true);
    try {
      await updateBasicProfile(editCorreo.trim());
      setUser(prev => ({ ...prev, correo: editCorreo.trim() }));
      toast.success("Correo actualizado");
      setShowEditModal(false);
    } catch (e) {
      toast.error(e.message || "Error al actualizar el correo");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!editPwActual || !editPwNueva || !editPwConfirm) {
      toast.error("Rellena todos los campos");
      return;
    }
    if (editPwNueva !== editPwConfirm) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (editPwNueva.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setEditLoading(true);
    try {
      await changePassword(editPwActual, editPwNueva);
      toast.success("Contraseña actualizada");
      setEditPwActual("");
      setEditPwNueva("");
      setEditPwConfirm("");
      setShowEditModal(false);
    } catch (e) {
      toast.error(e.message || "Error al cambiar la contraseña");
    } finally {
      setEditLoading(false);
    }
  };

  const handleWheel = (e) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
  };

  const renderAvatarLarge = () => {
    const url = normalizeImage(user?.imagen_avatar);
    if (url) return <img src={url} alt="Avatar" className="avatar-img-full" />;
    return <span className="avatar-emoji-large">{user?.imagen_avatar || "👤"}</span>;
  };

  if (loading) {
    return (
      <div className="home-screen">
        <p className="placeholder-text">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="home-screen">
      <div className="main-card-profile-layout">

        <header className="profile-header">
          <div className="user-info-main">
            <div className="avatar-large">
              {renderAvatarLarge()}
            </div>
            <div className="user-text-details">
              <div className="username-row">
                <h1>{user?.nombre_usuario || "Usuario"}</h1>
                <button className="btn-edit-profile" onClick={openEdit} title="Editar perfil">
                  ✏️ Editar
                </button>
              </div>
              <AnimatedCoins coins={user?.monedas || 0} className="stat-pill coins-pill" />
            </div>
          </div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <span className="back-icon">↩</span> Volver
          </button>
        </header>

        <section className="profile-grid">
          <ProfileBox title="Victorias" value={user?.victorias || "0"} icon="🏆" />
          <ProfileBox title="Partidas" value={user?.partidas || "0"} icon="⭐" />
          <ProfileBox title="Amigos" value={friendsCount} icon="👥" />
        </section>

        <div className="selection-container">
          <h3 className="section-title">Mis Avatares</h3>
          <div className="selection-row scrollable-row" ref={scrollRef} onWheel={handleWheel}>
            {myAvatars.map((av, index) => (
              <AvatarItem
                key={av.id_avatar}
                index={index}
                icon={normalizeImage(av.image) || av.image}
                isActive={user?.id_avatar_seleccionado === Number(av.id_avatar)}
                onClick={() => handleSelectAvatar(av.id_avatar)}
              />
            ))}
          </div>

          <h3 className="section-title">Mis Diseños de Cartas</h3>
          <div className="selection-row scrollable-row">
            {myStyles.map((style, index) => (
              <CardDesignItem
                key={style.id_estilo}
                title={style.nombre || "Diseño"}
                icon={style.image}
                isActive={user?.id_estilo_seleccionado === Number(style.id_estilo)}
                onClick={() => handleSelectStyle(style.id_estilo)}
                index={index}
              />
            ))}
          </div>
        </div>

      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-profile-panel" onClick={e => e.stopPropagation()}>
            <button className="close-modal-x" onClick={() => setShowEditModal(false)}>✖</button>
            <h2 className="settings-title-green">EDITAR PERFIL</h2>

            <div className="edit-tabs">
              <button
                className={`edit-tab-btn ${editTab === "correo" ? "active" : ""}`}
                onClick={() => setEditTab("correo")}
              >
                📧 Correo
              </button>
              <button
                className={`edit-tab-btn ${editTab === "password" ? "active" : ""}`}
                onClick={() => setEditTab("password")}
              >
                🔒 Contraseña
              </button>
            </div>

            {editTab === "correo" && (
              <div className="edit-form">
                <label className="edit-label">Nuevo correo electrónico</label>
                <input
                  className="edit-input"
                  type="email"
                  value={editCorreo}
                  onChange={e => setEditCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  autoFocus
                />
                <button
                  className="edit-save-btn"
                  onClick={handleSaveCorreo}
                  disabled={editLoading}
                >
                  {editLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            )}

            {editTab === "password" && (
              <div className="edit-form">
                <label className="edit-label">Contraseña actual</label>
                <input
                  className="edit-input"
                  type="password"
                  value={editPwActual}
                  onChange={e => setEditPwActual(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
                <label className="edit-label">Nueva contraseña</label>
                <input
                  className="edit-input"
                  type="password"
                  value={editPwNueva}
                  onChange={e => setEditPwNueva(e.target.value)}
                  placeholder="••••••••"
                />
                <label className="edit-label">Confirmar nueva contraseña</label>
                <input
                  className="edit-input"
                  type="password"
                  value={editPwConfirm}
                  onChange={e => setEditPwConfirm(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  className="edit-save-btn"
                  onClick={handleSavePassword}
                  disabled={editLoading}
                >
                  {editLoading ? "Guardando..." : "Cambiar contraseña"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;