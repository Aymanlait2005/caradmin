import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Collapse, Container } from "reactstrap";

import logoSm from "../../assets/images/logo-sm.png";

// Import Data

// SimpleBar
import SimpleBar from "simplebar-react"; 
import "simplebar-react/dist/simplebar.min.css"; 
import Navdata from "../layoutMenuData/LayoutMenuData";
import VerticalLayout from "../verticalLayout/VerticalLayout";

const TwoColumnLayout = (props) => {
  const navData = Navdata(); 

  const [isMenu, setIsMenu] = useState("twocolumn");

  const path = props.router.location.pathname;

  // === Active les bons liens selon le chemin ===
  const activateParentDropdown = useCallback((item) => {
    if (!item) return;
    item.classList.add("active");

    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    while (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      const parentLink = parentCollapseDiv.previousElementSibling;
      if (parentLink) parentLink.classList.add("active");
      parentCollapseDiv = parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown");
    }
  }, []);

  const initMenu = useCallback(() => {
    const ul = document.getElementById("navbar-nav");
    if (!ul) return;
    const items = ul.getElementsByTagName("a");
    const pathName = process.env.PUBLIC_URL + path;

    let matchingMenuItem = Array.from(items).find((x) => x.pathname === pathName);
    if (matchingMenuItem) activateParentDropdown(matchingMenuItem);
  }, [path, activateParentDropdown]);

  // === Active au chargement ===
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    initMenu();
  }, [path, initMenu]);

  // === Responsive: change de layout selon la taille ===
  const handleResize = useCallback(() => {
    const windowSize = document.documentElement.clientWidth;
    if (windowSize < 767) {
      document.documentElement.setAttribute("data-layout", "vertical");
      setIsMenu("vertical");
    } else {
      document.documentElement.setAttribute("data-layout", "twocolumn");
      setIsMenu("twocolumn");
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <React.Fragment>
      {isMenu === "twocolumn" ? (
        <div id="scrollbar">
          <Container fluid>
            <div id="two-column-menu">
              <SimpleBar className="twocolumn-iconview">
                <Link to="#" className="logo d-block mb-3">
                  <img src={logoSm} alt="Logo" height="22" />
                </Link>

                {(navData || []).map((item, key) => (
                  <React.Fragment key={key}>
                    {item.icon && (
                      <Link
                        to={item.link || "#"}
                        subitems={item.id}
                        className="nav-icon"
                        data-bs-toggle="collapse"
                      >
                        <i className={item.icon}></i>
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </SimpleBar>
            </div>

            <SimpleBar id="navbar-nav" className="navbar-nav">
              {(navData || []).map((item, key) => (
                <React.Fragment key={key}>
                  {item.subItems && (
                    <li className="nav-item">
                      <Collapse className="menu-dropdown" id={item.id}>
                        <ul className="nav nav-sm flex-column">
                          {item.subItems.map((sub, subKey) => (
                            <li className="nav-item" key={subKey}>
                              <Link to={sub.link || "#"} className="nav-link">
                                {props.t(sub.label)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </SimpleBar>
          </Container>
        </div>
      ) : (
        <SimpleBar id="scrollbar" className="h-100">
          <Container fluid>
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayout />
            </ul>
          </Container>
        </SimpleBar>
      )}
    </React.Fragment>
  );
};

TwoColumnLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default TwoColumnLayout;
