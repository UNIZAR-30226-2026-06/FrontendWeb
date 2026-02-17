import React from "react";
import "../styles/Loader.css";

const Loader = () => {
  const dots = Array.from({ length: 12 });

  return (
    <div className="pl">
      {dots.map((_, i) => (
        <div key={i} className="pl__dot"></div>
      ))}
      <div className="pl__text">Loading…</div>
    </div>
  );
};

export default Loader;