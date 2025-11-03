import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const [role, setRole] = useState("Admin");
  const history = useNavigate();

  // Déterminer le rôle à partir du sessionStorage
  useEffect(() => {
    const authUser = sessionStorage.getItem("authUser");
    if (authUser) {
      try {
        const obj = JSON.parse(authUser);
        const userType =
          obj?.user?.user_type ||
          obj?.user_type ||
          process.env.REACT_APP_DEFAULT_ROLE ||
          "Admin";
        setRole(userType);
      } catch (error) {
        console.error("Erreur lors du parsing de authUser :", error);
        setRole("Admin");
      }
    }
  }, []);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [isUser, setIsUser] = useState(false);
  const [isStopSell, setIsStopSell] = useState(false);

  const updateIconSidebar = (e) => {
    if (e?.target?.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul?.querySelectorAll(".nav-icon.active") || [];
      [...iconItems].forEach((item) => {
        item.classList.remove("active");
        const id = item.getAttribute("subitems");
        document.getElementById(id)?.classList.remove("show");
      });
    }
  };

  const AdminMenuItems = [
    {
      label: "Menu",
      isHeader: true,
    },

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/admin/dashboard-analytics",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("dashboard");
      },
    },


    {
      id: "user",
      label: "Utilisateurs",
      icon: "ri-group-line", 
      link: "/admin/users/#",
      stateVariables: isUser,
      click: function (e) {
        e.preventDefault();
        setIsUser(!isUser);
        setIscurrentState("User");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "admin",
          label: "Admins",
          link: "/admin/users/admins",
          parentId: "user",
        },
        {
          id: "vendor",
          label: "Partenaires",
          link: "/admin/users/partners",
          parentId: "user",
        },

      ],
    },

    {
      id: "client",
      label: "Client",
      icon: "ri-user-3-line",
      link: "/admin/clients",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("client");
      },
    },
    {
      id: "reservation",
      label: "Reservations",
      icon: "ri-calendar-check-line",
      link: "/admin/reservation",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("reservation");
      },
    },

    {
      id: "calendar",
      label: "Calendrier",
      icon: "ri-calendar-line",
      link: "/admin/calendar",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("calendar");
      },
    },

    {
      label: "Avantages",
      isHeader: true,
    },

    {
      id: "Tax",
      label: "Taxes",
      icon: "ri-money-dollar-box-line",
      link: "/admin/tax",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("tax");
      },
    },

    {
      id: "Coupon",
      label: "Coupons",
      icon: "ri-price-tag-3-line",
      link: "/admin/Coupon",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("coupon");
      },
    },

    {
      id: "Location",
      label: "Localisation",
      icon: "ri-map-pin-line",
      link: "/admin/location",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("location");
      },
    },

    {
      id: "Locationtype",
      label: "Type de Localisation",
      icon: "ri-map-2-line",
      link: "/admin/Locationtype",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Locationtype");
      },
    },

    {
      label: "Voitures",
      isHeader: true,
    },

    {
      id: "listjs",
      label: "Categories",
      icon: "ri-folder-line",
      link: "/admin/categories",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("brand");
      },
    },
    {
      id: "brand",
      label: "Marques",
      icon: "ri-star-line",
      link: "/admin/brand",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("brand");
      },
    },

    {
      id: "serie",
      label: "Serie",
      icon: "ri-stack-line",
      link: "/admin/serie",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("serie");
      },
    },

    // {
    //   id: "agence",
    //   label: "Agence",
    //   icon: "ri-honour-line",
    //   link: "/admin/agence",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("agence");
    //   },
    // },

    {
      id: "cars",
      label: "Voitures",
      icon: "ri-car-line",
      link: "/admin/cars",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("cars");
      },
    },
    
    {
      label: "Contact",
      isHeader: true,
    },
    
        {
          id: "about-us",
          label: "About us",
          icon: "ri-information-line",
          link: "/admin/about-us",
          click: function (e) {
            e.preventDefault();
            setIscurrentState("about-us");
          },
        },
  ];

  const VendorMenuItems = [
    {
      label: "Menu",
      isHeader: true,
    },

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/partner/dashboard-analytics",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("dashboard");
      },
    },
    {
      id: "user",
      label: "Utilisateur",
      icon: "ri-user-line",
      link: "/partner/users/employees",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("user");
      },
    },

    {
      label: "Components",
      isHeader: true,
    },
    {
      id: "agence",
      label: "Agences",
      icon: "ri-building-line",
      link: "/partner/agence",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("agence");
      },
    },

    {
      id: "cars",
      label: "Voitures",
      icon: "ri-car-line",
      link: "/partner/cars",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("cars");
      },
    },
    {
      id: "calendar",
      label: "Calendrier",
      icon: "ri-calendar-line",
      link: "/partner/calendar",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("calendar");
      },
    },


    {
      id: "caroption",
      label: "Choix De Voiture",
      icon: "ri-tools-line",
      link: "/partner/car-option",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("caroption");
      },
    },

    {
      id: "stopsell",
      label: "Arrêt de vente",
      icon: "ri-alert-line", // Example icon class
      link: "/partner/stop-sell/#",
      stateVariables: isStopSell,
      click: function (e) {
        e.preventDefault();
        setIsStopSell(!isStopSell);
        setIscurrentState("StopSell");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "stopsellcars",
          label: "Voitures",
          link: "/partner/stop-sell/cars",
          parentId: "stopsell",
        },
        {
          id: "stopsellagence",
          label: "Agences",
          link: "/partner/stop-sell/agencies",
          parentId: "stopsell",
        },

      ],
    },
  ];

  const EmployeeMenuItems = [
    {
      label: "Menu",
      isHeader: true,
    },

    {
      id: "dashboard",
      label: "dashboard",
      icon: "ri-dashboard-2-line",
      link: "/employee/dashboard-analytics",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("dashboard");
      },
    },

    {
      label: "Components",
      isHeader: true,
    },
    {
      id: "cars",
      label: "Cars",
      icon: "ri-honour-line",
      link: "/employee/cars",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("cars");
      },
    },

    {
      id: "calendar",
      label: "calendar",
      icon: "ri-honour-line",
      link: "/employee/calendar",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("calendar");
      },
    },

    {
      id: "reservation",
      label: "reservation",
      icon: "ri-honour-line",
      link: "/employee/reservation",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("reservation");
      },
    },
  ];

  const lowerRole = role?.toLowerCase?.() || "admin";

  return (
    <>
      {lowerRole === "admin"
        ? AdminMenuItems
        : lowerRole === "vendor"
        ? VendorMenuItems
        : EmployeeMenuItems}
    </>
  );
};

export default Navdata;