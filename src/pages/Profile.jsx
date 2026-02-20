import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBox from "../components/ProfileBox";
import AvatarItem from "../components/AvatarItem";
import CardDesignItem from "../components/CardDesignItem"; 
import "../styles/Profile.css"; 

const Profile = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };
  const [selectedAvatar, setSelectedAvatar] = useState("🤠");
  const [selectedDesign, setSelectedDesign] = useState("Classic");
  
  const avatares = ["👤", "🤖", "🤠", "😈", "👽", "👻", "🐱", "🐶"];
  const diseños = [
    { id: "Classic", title: "Classic", icon: "🍃" },
    { id: "Neon", title: "Neón", icon: "🌙" }
  ];
  return (
    <div className="home-screen">
      <div className="main-card-profile-layout">
        <header className="profile-header">
          <div className="user-info-main">
            <div className="avatar-large">{selectedAvatar}</div>
            <div className="user-text-details">
              <h1>Jugador 1</h1>
              <div className="stat-pill coins-pill">💰 500 Monedas</div>
            </div>
          </div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <span className="back-icon">↩</span> Volver
          </button>
        </header>

        <section className="profile-grid">
          <ProfileBox title="Victorias" value="0" icon="🏆" />
          <ProfileBox title="Partidas jugadas" value="0" icon="⭐" />
          <ProfileBox title="Amigos" value="1" icon="👥" />
        </section>

        <div className="selection-container">
          <h3 className="section-title">Avatares</h3>
          <div className="selection-row scrollable-row" ref={scrollRef} onWheel={handleWheel}>
            {avatares.map((icon, index) => (
              <AvatarItem 
                key={index}
                icon={icon} 
                isActive={selectedAvatar === icon}
                onClick={() => setSelectedAvatar(icon)}
              />
            ))}
          </div>

          <h3 className="section-title">Diseño de cartas</h3>
          <div className="selection-row">
            {diseños.map((dis) => (
              <CardDesignItem 
                key={dis.id}
                title={dis.title}
                icon={dis.icon}
                isActive={selectedDesign === dis.id}
                onClick={() => setSelectedDesign(dis.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;