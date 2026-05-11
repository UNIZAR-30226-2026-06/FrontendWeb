import React, { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import "../styles/ProfileBox.css";

const ProfileBox = ({ title, value, icon, children, className = "" }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const num = parseFloat(value);
    if (!nodeRef.current || isNaN(num)) return;

    const raf = requestAnimationFrame(() => {
      const controls = animate(0, num, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate: (v) => {
          if (nodeRef.current) nodeRef.current.textContent = Math.round(v);
        },
      });
      return () => controls.stop();
    });

    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className={`profile-box ${className}`}>
      {icon && <span className="box-icon">{icon}</span>}
      {title && <p className="box-title">{title}</p>}
      {value !== undefined && (
        <strong className="box-value">
          {isNaN(parseFloat(value)) ? value : <span ref={nodeRef}>0</span>}
        </strong>
      )}
      {children}
    </div>
  );
};

export default ProfileBox;