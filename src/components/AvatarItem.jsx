import "../styles/AvatarItem.css"; 

const AvatarItem = ({ icon, isActive, onClick }) => (
  <button className={`avatar-item ${isActive ? "active" : ""}`} onClick={onClick}>
    {icon}
  </button>
);
export default AvatarItem;