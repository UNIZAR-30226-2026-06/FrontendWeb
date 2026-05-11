import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ShopFilter from "../components/ShopFilter";
import ShopItem from "../components/ShopItem";
import ConfirmModal from "../components/ConfirmModal"; 
import SearchBar from "../components/SearchBox"; 
import AnimatedCoins from "../components/AnimatedCoins";
import "../styles/Shop.css";

import { getStoreAvatars, getStoreEstilos, getWalletBalance, purchaseAvatar, purchaseEstilo, getMyBoughtAvatars, getMyBoughtStyles } from "../services/userService";

const Shop = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]); 
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [avatarsDB, estilosDB, walletDB, boughtAvatars, boughtStyles] = await Promise.all([ getStoreAvatars(), getStoreEstilos(), getWalletBalance(), getMyBoughtAvatars(), getMyBoughtStyles() ]);

        const myAvatarIds = (boughtAvatars || []).map(a => a.id_avatar);
        const myStyleIds = (boughtStyles || []).map(s => s.id_estilo);

        const avataresLimpios = (avatarsDB || []).map(a => ({
          id: a.id_avatar,          
          name: a.nombre, 
          price: Number(a.precioavatar) || 0,     
          type: "Avatares",
          icon: a.image,
          owned: myAvatarIds.includes(a.id_avatar)
        }));

        const estilosLimpios = (estilosDB || []).map(e => ({
          id: e.id_estilo,
          name: e.nombre,
          price: Number(e.precioestilo) || 0,
          type: "Diseño de cartas",
          icon: e.image,
          owned: myStyleIds.includes(e.id_estilo)
        }));

        setItems([...avataresLimpios, ...estilosLimpios]);
        setUserCoins(walletDB.coins || 0);

      } catch (error) {
        console.error("Error al cargar la tienda:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBuyClick = (item) => {
    if (item.owned) return; 
    
    if (userCoins < item.price) {
      toast.error("No tienes suficientes monedas");
      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmPurchase = async () => {
    try {
      let response;
      
      if (selectedItem.type === "Avatares") {
        response = await purchaseAvatar(selectedItem.id);
      } else {
        response = await purchaseEstilo(selectedItem.id);
      }

      toast.success("¡Compra realizada!", {
        description: `Has adquirido ${selectedItem.name} correctamente.`,
      });

      setItems(prevItems => 
        prevItems.map(item => 
          (item.id === selectedItem.id && item.type === selectedItem.type) 
            ? { ...item, owned: true } 
            : item
        )
      );

      const actualCoins = response?.monedas !== undefined ? response.monedas : response?.coins;

      if (actualCoins !== undefined) {
        setUserCoins(actualCoins);
      } else {
        setUserCoins(prev => prev - selectedItem.price);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error en la compra:", error);
      toast.error("Error al procesar la compra");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "Todos" || item.type === filter;
    const matchesSearch = (item.name || "").toLowerCase().includes(searchQuery.toLowerCase());
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
            <AnimatedCoins coins={userCoins} className="stat-pill coins-pill" />
            <button className="btn-back-shop" onClick={() => navigate(-1)}>
              <span className="back-icon">↩</span> Volver
            </button>
          </div>
        </header>

        <ShopFilter activeFilter={filter} setFilter={setFilter} />
        
        <div className="shop-search-wrapper">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <section className="shop-grid">
          {loading ? (
            <p className="no-results-text">Cargando catálogo...</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ShopItem 
                key={`${item.type}-${item.id}`} 
                item={item} 
                onBuy={() => handleBuyClick(item)} 
              />
            ))
          ) : (
            <p className="no-results-text">No hay artículos disponibles.</p>
          )}
        </section>
      </div>

      {showModal && selectedItem && (
        <ConfirmModal 
          type="success" 
          message={`¿Seguro que desea comprar "${selectedItem.name}" por ${selectedItem.price} monedas?`}
          confirmLabel="Comprar" 
          onConfirm={confirmPurchase}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Shop;