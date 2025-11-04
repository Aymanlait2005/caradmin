import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// import logos
import logoSm from "../../assets/images/LOUPE copy.png";
import logoLight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logolast.png"; 
// import components
import { Container } from "reactstrap";
import SimpleBar from "simplebar-react"; 
import "simplebar-react/dist/simplebar.min.css"; 
import VerticalLayout from "../verticalLayout/VerticalLayout";
import HorizontalLayout from "../horizontalLayout/HorizontalLayout";

const Sidebar = ({ layoutType }) => {

  useEffect(() => {
    const verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay.length > 0) {
      verticalOverlay[0].addEventListener("click", () => {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  }, []);
  useEffect(() => {
    // ✅ S'assure que l'attribut de layout est défini au montage
    if (!document.documentElement.getAttribute("data-layout")) {
      document.documentElement.setAttribute("data-layout", layoutType);
    }
  
    // ✅ Définit une taille par défaut si aucune n'existe
    if (!document.documentElement.getAttribute("data-sidebar-size")) {
      document.documentElement.setAttribute("data-sidebar-size", "lg");
    }
  }, [layoutType]);

  const addEventListenerOnSmHoverMenu = () => {
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };
  
  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="40" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="30" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="17" />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;