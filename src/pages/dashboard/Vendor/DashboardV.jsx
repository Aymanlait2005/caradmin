import React, { useEffect, useState } from "react";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import { api } from "../../../config";
import FeatherIcon from "feather-icons-react";

function DashboardV() {
    
  const [vendorData, setVendorData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ Aucun token trouvé, utilisateur non connecté.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/vendor/vendor-dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log("✅ Réponse API complète :", response);

        // ✅ Protection supplémentaire
        if (response && response.data) {
          setVendorData(response.data);
        } else {
          console.error("⚠️ Réponse API inattendue :", response);
        }
      })
      .catch((error) => {
        console.error("❌ Erreur API :", error);
      })
      .finally(() => {
      });
  }, []);
  if (!vendorData) {
    return (
      <p className="text-center mt-4 text-muted">
        Aucune donnée disponible pour ce vendeur.
      </p>
    );
  }
  
      return (
        <div className="page-content">
          <div className="container-fluid">
          <Row className="g-4 align-items-stretch">
                <Col xl={3} md={6} >
                <Card className="card-animate h-80 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Réservations du Mois
                          </p>
                        </div>

                      </div>
    
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            <CountUp
                              start={0}
                              end={vendorData.data.global_view.total_reservations.month}
                            />
                          </h4>
                          <p className="mb-0 text-muted">
                                <span className="badge bg-light text-info mb-0">
                                    <i className="ri-calendar-line align-middle"></i> Cette semaine: {vendorData.data.global_view.total_reservations.week}
                                </span>
                          </p>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-info-subtle rounded-circle fs-2">
                            <FeatherIcon
                                icon="calendar"
                                className="text-info"
                            />
                        </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={3} md={6} >
                <Card className="card-animate h-80 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Réservations du Mois
                          </p>
                        </div>
                        
                      </div>
    
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
 
                            <CountUp
                              start={0}
                              end={vendorData.data.global_view.revenue.total}
                              decimals={2}
                              duration={4}
                              suffix=" DH"
                              

                              
                            />
                          </h4>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="dollar-sign"
                                                className="text-success"
                                            />
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={3} md={6} >
                <Card className="card-animate h-80 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Voitures Disponibles
                          </p>
                        </div>
                        
                      </div>
    
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
 
                            <CountUp
                              start={0}
                              end={vendorData.data.global_view.cars_status.available}
                              
                            />
                          </h4>
                          <p className="mb-0 text-muted">
                                        <span className="badge bg-light text-warning mb-0">
                                            <i className="ri-car-line align-middle"></i> Indisponibles: {vendorData.data.global_view.cars_status.unavailable || 0}
                                        </span>
                                    </p>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-warning-subtle rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="car"
                                                className="text-warning"
                                            />
                                        </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={3} md={6} >
                <Card className="card-animate h-80 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Satisfaction Client
                          </p>
                        </div>
                        
                      </div>
    
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
 
                          <span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={vendorData.data.global_view.customer_satisfaction}
                                                decimals={1}
                                                duration={4}
                                                suffix="/10"
                                            />
                                        </span>
                          </h4>
                          <p className="mb-0 text-muted">
  <span className="badge bg-light text-warning mb-0 badge-sm">
    <FeatherIcon icon="star" className="text-warning me-1" width={12} />
    <span>Note moyenne</span>
  </span>
</p>

                        </div>
                        <div className="avatar-sm flex-shrink-0">
  <span className="avatar-title bg-danger-subtle rounded-circle fs-2">
    <FeatherIcon icon="star" className="text-danger" />
  </span>
</div>

                      </div>
                    </CardBody>
                  </Card>
                </Col>

            </Row>
          </div>
          
        </div>
      );
}
export default  DashboardV