import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Collapse } from 'reactstrap';
import Navdata from '../layoutMenuData/LayoutMenuData';

const VerticalLayout = (props) => {
  const navData = Navdata().props.children;
  const location = useLocation();
  const path = location.pathname;
 console.log(navData)

  // valeurs par défaut (avant c’était useSelector)
  const leftsidbarSizeType = "lg";
  const sidebarVisibilitytype = "show";
  const layoutType = props.layoutType || "vertical";

  // Gestion du redimensionnement
  const resizeSidebarMenu = useCallback(() => {
    var windowSize = document.documentElement.clientWidth;
    if (windowSize >= 1025) {
      if (document.documentElement.getAttribute("data-layout") === "vertical") {
        document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
      }
      if (document.documentElement.getAttribute("data-layout") === "semibox") {
        document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
      }

      const hamburgerIcon = document.querySelector(".hamburger-icon");
      if (hamburgerIcon) hamburgerIcon.classList.remove("open");

    } else if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove("twocolumn-panel");
      document.documentElement.setAttribute("data-sidebar-size", "sm");
      const hamburgerIcon = document.querySelector(".hamburger-icon");
      if (hamburgerIcon) hamburgerIcon.classList.add("open");
    } else if (windowSize <= 767) {
      document.body.classList.remove("vertical-sidebar-enable");
      if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
      const hamburgerIcon = document.querySelector(".hamburger-icon");
      if (hamburgerIcon) hamburgerIcon.classList.add("open");
    }
  }, [leftsidbarSizeType]);

  useEffect(() => {
    window.addEventListener("resize", resizeSidebarMenu, true);
    return () => window.removeEventListener("resize", resizeSidebarMenu, true);
  }, [resizeSidebarMenu]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const initMenu = () => {
      const pathName = process.env.PUBLIC_URL + path;
      const ul = document.getElementById("navbar-nav");
      if (!ul) return;
      const items = ul.getElementsByTagName("a");
      const itemsArray = [...items];
      removeActivation(itemsArray);
      const matchingMenuItem = itemsArray.find((x) => x.pathname === pathName);
      if (matchingMenuItem) activateParentDropdown(matchingMenuItem);
    };
    if (layoutType === "vertical") {
      initMenu();
    }
  }, [path, layoutType]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
      }
    }
  }

  const removeActivation = (items) => {
    items.forEach((item) => {
      item.classList.remove("active");
      if (item.nextElementSibling) {
        item.nextElementSibling.classList.remove("show");
      }
    });
  };

  return (
    <React.Fragment>
      {(navData || []).map((item, key) => (
        <React.Fragment key={key}>
          {item.isHeader ? (
            <li className="menu-title">
              <span>{item.label}</span>
            </li>
          ) : item.subItems ? (
            <li className="nav-item">
              <Link
                onClick={item.click}
                className="nav-link menu-link"
                to={item.link || "/#"}
                data-bs-toggle="collapse"
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
              <Collapse className="menu-dropdown" isOpen={item.stateVariables}>
                <ul className="nav nav-sm flex-column">
                  {(item.subItems || []).map((subItem, key) => (
                    <li className="nav-item" key={key}>
                      <Link
                        to={subItem.link || "/#"}
                        className="nav-link"
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link menu-link" to={item.link || "/#"}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default VerticalLayout;