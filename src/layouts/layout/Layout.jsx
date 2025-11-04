import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

export default function Layout({ children }) {
  const [headerClass, setHeaderClass] = useState("");
  const [layoutType, setLayoutType] = useState("vertical"); // ✅ Définit le type de layout

  // ✅ Ajoute l’attribut data-layout au HTML
  useEffect(() => {
    document.documentElement.setAttribute("data-layout", layoutType);
  }, [layoutType]);

  // ✅ Ombre du header au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 50) {
        setHeaderClass("topbar-shadow");
      } else {
        setHeaderClass("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        {/* Header */}
        <Header headerClass={headerClass} layoutType={layoutType} />

        {/* Wrapper principal (évite le doublon d’ID) */}
        <div className="app-container">
          <Sidebar layoutType={layoutType} />

          <main className="main-content">
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </React.Fragment>

  );
}
