import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // 🔹 Notifier le backend si nécessaire
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post(
            "http://127.0.0.1:8000/api/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.warn("Erreur lors de la déconnexion serveur :", error.message);
      } finally {
        // 🔹 Nettoyer le stockage local
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 🔹 Redirection vers /login
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Déconnexion...</h2>
      <p>Veuillez patienter...</p>
    </div>
  );
}

export default Logout;
