import React from "react";
import "../styles/ShopFilter.css";

const ShopFilter = ({ activeFilter, setFilter }) => {
  const categories = ["Todos", "Avatares", "Diseño de cartas"];

  return (
    <nav className="shop-filters">
      {categories.map((f) => (
        <button 
          key={f}
          className={`filter-btn ${activeFilter === f ? "active" : ""}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </nav>
  );
};

export default ShopFilter;