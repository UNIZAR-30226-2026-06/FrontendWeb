import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileBox from "../components/ProfileBox";
import AvatarItem from "../components/AvatarItem";
import CardDesignItem from "../components/CardDesignItem";
import { getMyProfile, getMyBoughtAvatars, getMyBoughtStyles, updateActiveAvatar,  updateActiveStyle, getFriendsCount } from "../services/userService";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [user, setUser] = useState(null);
  const [myAvatars, setMyAvatars] = useState([]);
  const [myStyles, setMyStyles] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, avatarsData, stylesData, countData] = await Promise.all([ getMyProfile(), getMyBoughtAvatars(), getMyBoughtStyles(), getFriendsCount() ]);

        const currentAvatarId = profileData.avatar;
        const currentStyleId = profileData.estilo; 
        
        const activeAvatar = avatarsData.find(av => av.id_avatar === currentAvatarId);

        setUser({
          ...profileData,
          id_avatar_seleccionado: currentAvatarId,
          id_estilo_seleccionado: currentStyleId,
          imagen_avatar: activeAvatar ? activeAvatar.image : "👤"
        });
        
        setMyAvatars(avatarsData);
        setMyStyles(stylesData);
        
        setFriendsCount(typeof countData === 'object' ? (countData.count || countData.total || 0) : countData);

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
      const newAvatar = myAvatars.find(a => a.id_avatar === avatarId);
      setUser({ 
        ...user, 
        imagen_avatar: newAvatar.image,
        id_avatar_seleccionado: avatarId 
      });
      localStorage.setItem("userAvatar", newAvatar.image);
      toast.success("Avatar actualizado");
    } catch (error) {
      toast.error("No se pudo cambiar el avatar");
    }
  };

  const handleSelectStyle = async (styleId) => {
    try {
      await updateActiveStyle(styleId);

      setUser({ 
        ...user, 
        id_estilo_seleccionado: styleId 
      });
      
      const newStyle = myStyles.find(s => s.id_estilo === styleId);
      if (newStyle) {
        localStorage.setItem("cardDesign", newStyle.nombre);
      }
      
      toast.success("Diseño de cartas actualizado");
    } catch (error) {
      console.error("Error cambiando estilo:", error);
      toast.error("No se pudo cambiar el diseño");
    }
  };

  const handleWheel = (e) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
  };

  if (loading) return <div className="home-screen"><p className="placeholder-text">Cargando perfil...</p></div>;

  return (
    <div className="home-screen">
      <div className="main-card-profile-layout">
        <header className="profile-header">
          <div className="user-info-main">
            <div className="avatar-large">
              {user?.imagen_avatar?.includes('.') || user?.imagen_avatar?.includes('/') ? (
                <img 
                  src={user.imagen_avatar.startsWith('/') ? user.imagen_avatar : `/img/${user.imagen_avatar}`} 
                  alt="Avatar" 
                  className="avatar-img-full" 
                />
              ) : (
                <span className="avatar-emoji-large">{user?.imagen_avatar || "👤"}</span>
              )}
            </div>
            <div className="user-text-details">
              <h1>{user?.nombre_usuario || "Usuario"}</h1>
              <div className="stat-pill coins-pill">💰 {user?.monedas || 0} Monedas</div>
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
            {myAvatars.map((av) => (
              <AvatarItem 
                key={av.id_avatar}
                icon={av.image?.includes('.') && !av.image.startsWith('/') ? `/img/${av.image}` : av.image} 
                isActive={user?.id_avatar_seleccionado === av.id_avatar}
                onClick={() => handleSelectAvatar(av.id_avatar)}
              />
            ))}
          </div>

          <h3 className="section-title">Mis Diseños de Cartas</h3>
          <div className="selection-row">
            {myStyles.map((style) => (
              <CardDesignItem 
                key={style.id_estilo}
                title={style.nombre || "Diseño"}
                icon={style.image} 
                isActive={user?.id_estilo_seleccionado === style.id_estilo}
                onClick={() => handleSelectStyle(style.id_estilo)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;