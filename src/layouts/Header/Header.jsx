import React from "react";
import ProfileDropdown from "./ProfileDropdown";
import FullScreenDropdown from "./FullScreenDropdown";

function Header({ headerClass }) {
  // 👉 Fonction pour ouvrir/fermer la sidebar selon la taille d’écran
  const toggleMenuBtn = () => {
    const windowSize = document.documentElement.clientWidth;

    // === Pour layout vertical ou semibox ===
    if (
      document.documentElement.getAttribute("data-layout") === "vertical" ||
      document.documentElement.getAttribute("data-layout") === "semibox"
    ) {
      if (windowSize > 1025) {
        // Desktop : toggle entre grand (lg) et petit (sm)
        const current = document.documentElement.getAttribute("data-sidebar-size");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          current === "lg" ? "sm" : "lg"
        );
      } else if (windowSize > 767 && windowSize <= 1025) {
        // Tablette : sidebar compacte
        document.body.classList.remove("vertical-sidebar-enable");
        const current = document.documentElement.getAttribute("data-sidebar-size");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          current === "sm" ? "" : "sm"
        );
      } else {
        // Mobile : affiche / masque la sidebar
        document.body.classList.toggle("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    // === Pour layout horizontal ===
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.toggle("menu");
    }

    // === Pour layout à deux colonnes ===
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.toggle("twocolumn-panel");
    }

    // === Animation de l’icône hamburger ===
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle("open");
    }
  };

  return (
    <header id="page-topbar" className={headerClass}>
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            {/* === Bouton hamburger === */}
            <button
              onClick={toggleMenuBtn}
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          {/* === Menu à droite : plein écran + profil === */}
          <div className="d-flex align-items-center">
            <FullScreenDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
