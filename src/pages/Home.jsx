// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenue, {user?.name || "Utilisateur"} 👋</h1>
      <p>Vous êtes connecté à Rental 365.</p>

      <Link
        to="/logout"
        style={{
          display: "inline-block",
          marginTop: "20px",
          background: "#198754",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Se déconnecter
      </Link>
    </div>
  );
}

export default Home;
