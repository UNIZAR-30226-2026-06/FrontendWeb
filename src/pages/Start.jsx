import React from "react";
import AuthCard from "../components/AuthCard";
import "../styles/Start.css";

const Start = () => {
  return (
    <div className="start-screen">
      <div className="auth-container">
        <AuthCard />
      </div>
    </div>
  );
};

export default Start;