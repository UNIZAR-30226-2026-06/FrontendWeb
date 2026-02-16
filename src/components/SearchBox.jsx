import React from "react";
import "../styles/SearchBox.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-bar-container">
      <span className="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Buscar usuarios..." 
        className="friends-search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="btn-clear-search" onClick={() => setSearchQuery("")}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;