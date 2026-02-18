import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ShopFilter from "../components/ShopFilter";
import ShopItem from "../components/ShopItem";
import ConfirmModal from "../components/ConfirmModal"; 
import SearchBar from "../components/SearchBox"; 
import "../styles/Shop.css";

const Shop = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    { id: 1, name: "Avatar Robot", price: 100, type: "Avatares", icon: "🤖" },
    { id: 2, name: "Avatar Alien", price: 300, type: "Avatares", icon: "👽" },
    { id: 3, name: "Diseño Dorado", price: 400, type: "Diseño de cartas", icon: "👑" },
    { id: 4, name: "Diseño Espacial", price: 500, type: "Diseño de cartas", icon: "🌌" },
  ];

  const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmPurchase = () => {
    toast.success("¡Compra realizada!", {
      description: `Has adquirido ${selectedItem.name} correctamente.`,
    });
    setShowModal(false);
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "Todos" || item.type === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="home-screen">
      <div className="main-card-profile-layout shop-container">
        <header className="profile-header">
          <div className="shop-title-section">
            <span className="shop-main-icon">🏪</span>
            <h1>Tienda</h1>
          </div>
          <div className="shop-header-actions">
            <div className="stat-pill coins-pill">💰 500 Monedas</div>
            <button className="btn-back-shop" onClick={() => navigate("/")}>
              <span className="back-icon">↩</span> Volver
            </button>
          </div>
        </header>

        <ShopFilter activeFilter={filter} setFilter={setFilter} />
        
        <div className="shop-search-wrapper">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <section className="shop-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ShopItem 
                key={item.id} 
                item={item} 
                onBuy={() => handleBuyClick(item)} 
              />
            ))
          ) : (
            <p className="no-results-text">No se encontraron artículos.</p>
          )}
        </section>
      </div>

      {showModal && (
        <ConfirmModal 
          type="success" 
          message={`¿Seguro que desea comprar la skin "${selectedItem.name}" por ${selectedItem.price} monedas?`}
          onConfirm={confirmPurchase}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Shop;