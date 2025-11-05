import React from "react";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

const Dashboard = () => {
    




  const widgets = [
    {
      label: "Total Ventes",
      badge: "ri-arrow-up-line",
      badgeClass: "success",
      percentage: 12.5,
      prefix: "$",
      suffix: "K",
      separator: ",",
      counter: 559.25,
      decimals: 2,
      link: "Voir les détails",
      icon: "ri-shopping-cart-2-line",
      bgcolor: "success",
    },
    {
      label: "Nouveaux Utilisateurs",
      badge: "ri-arrow-up-line",
      badgeClass: "info",
      percentage: 8.4,
      prefix: "",
      suffix: "",
      separator: ",",
      counter: 1200,
      decimals: 0,
      link: "Voir la liste",
      icon: "ri-user-3-line",
      bgcolor: "info",
    },
    {
      label: "Commandes",
      badge: "ri-arrow-down-line",
      badgeClass: "danger",
      percentage: -5.3,
      prefix: "",
      suffix: "",
      separator: ",",
      counter: 320,
      decimals: 0,
      link: "Détails commandes",
      icon: "ri-file-list-3-line",
      bgcolor: "danger",
    },
    {
      label: "Revenus Mensuels",
      badge: "ri-arrow-up-line",
      badgeClass: "primary",
      percentage: 15.6,
      prefix: "$",
      suffix: "K",
      separator: ",",
      counter: 48.5,
      decimals: 1,
      link: "Voir rapport",
      icon: "ri-bar-chart-line",
      bgcolor: "primary",
    },
  ];

  const vendor = {
    name: "AIRCAR",
    id: 1,
    status: "Inactive",
    stats: [
      { label: "Agences", value: 0, icon: "ri-map-pin-line", color: "primary" },
      { label: "Voitures", value: 1, icon: "ri-truck-line", color: "success" },
      { label: "Réservations", value: 15, icon: "ri-calendar-event-line", color: "warning" },
      { label: "Note Moyenne", value: "0/10", icon: "ri-star-line", color: "danger" },
      { label: "Revenus nets", value: "0 MAD", icon: "ri-money-dollar-circle-line", color: "info", badge: "Available" },
    ],
  };


  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          {widgets.map((item, key) => (
            <Col xl={3} md={6} key={key}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <h5 className={`fs-14 mb-0 text-${item.badgeClass}`}>
                        {item.badge ? (
                          <i className={`fs-13 align-middle ${item.badge}`}></i>
                        ) : null}{" "}
                        {item.percentage} %
                      </h5>
                    </div>
                  </div>

                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        <CountUp
                          start={0}
                          prefix={item.prefix}
                          suffix={item.suffix}
                          separator={item.separator}
                          end={item.counter}
                          decimals={item.decimals}
                          duration={4}
                        />
                      </h4>
                      <Link to="#" className="text-decoration-underline">
                        {item.link}
                      </Link>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span
                        className={`avatar-title rounded fs-3 bg-${item.bgcolor}-subtle`}
                      >
                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Card className="border-0 shadow-sm rounded-4">
            {/* ---  --- */}
          <CardBody>
            {/* --- Header --- */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Suivi Vendeur</h6>
              <Badge color="warning" pill className="text-white">
                {vendor.status}
              </Badge>
            </div>
    
            <hr className="my-2" />
    
            {/* --- Contenu principal : Profil + Cartes --- */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              
              {/* --- Profil du vendeur --- */}
              <div className="d-flex align-items-center flex-shrink-0" style={{ minWidth: "180px" }}>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-light me-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="ri-user-line fs-3 text-secondary"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{vendor.name}</h6>
                  <small className="text-muted">ID: {vendor.id}</small>
                </div>
              </div>
    
              {/* --- Petites cartes --- */}
              <div className="d-flex flex-wrap justify-content-start gap-2 flex-grow-1">
                {vendor.stats.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-3 p-2 px-3 d-flex align-items-center justify-content-between"
                    style={{
                      minWidth: "130px",
                      flex: "1 1 auto",
                      backgroundColor: "white",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`d-flex align-items-center justify-content-center rounded-circle bg-${item.color}-subtle text-${item.color}`}
                        style={{ width: "30px", height: "30px", fontSize: "16px" }}
                      >
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold small">{item.value}</h6>
                        <small className="text-muted">{item.label}</small>
                      </div>
                    </div>
    
                    {item.badge && (
                      <Badge color={item.color} pill>
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
    </div>
  );
};

export default Dashboard;
