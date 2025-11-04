import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import logoDark from "../assets/images/logolast.png"; 
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();



  // 🔹 Redirection si déjà connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate("/pages/dashboard/Dashboard");;
    }, []);

  // ✅ Schéma de validation
  const formik = useFormik({
    initialValues: {
      phone1_or_email: "",
      password: "",
    },
    validationSchema: Yup.object({
      phone1_or_email: Yup.string().email('Adresse e-mail invalide').required('Champ requis'),
      password: Yup.string().min(8, '8 caractères ou plus').required('Champ requis'),
    }),
    // ✅ Soumission du formulaire
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/login",
          values,
          { headers: { "Content-Type": "application/json" } }
          
        );

        if (data.status === "success") {
          const { token, user } = data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/pages/dashboard/Dashboard");
        } else {
          setErrors({ password: "Identifiants incorrects" });
        }
      } catch (error) {
        console.error("Erreur API :", error.response?.data || error.message);
      
        if (error.response?.status === 401) {
          setErrors({ password: "Identifiants incorrects" });
          toast.error("Invalid credentials");
        } 
        else if (error.response?.status === 422) {
          toast.error("Invalid credentials");
        } 
        else {
          toast.error("Invalid credentials");
        }
      }finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoDark} alt="Logo Rental 365" height="50" />
                </Link>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4 shadow-lg">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Bienvenue !</h5>
                    <p className="text-muted">Connectez-vous à Rental 365</p>
                  </div>

                  <div className="p-2 mt-4">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-4">
                        <Label htmlFor="phone1_or_email" className="form-label">
                          Email ou téléphone
                        </Label>
                        <Input
                          id="phone1_or_email"
                          type="text"
                          {...formik.getFieldProps("phone1_or_email")}
                          className={`form-control ${
                            formik.errors.phone1_or_email &&
                            formik.touched.phone1_or_email
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.errors.phone1_or_email &&
                        formik.touched.phone1_or_email ? (
                          <FormFeedback>
                            {formik.errors.phone1_or_email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="password" className="form-label">
                          Mot de passe
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          {...formik.getFieldProps("password")}
                          className={`form-control ${
                            formik.errors.password && formik.touched.password
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.errors.password && formik.touched.password ? (
                          <FormFeedback>{formik.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check mb-4">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="auth-remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="auth-remember-check"
                        >
                          Se souvenir de moi
                        </Label>
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          className="btn btn-success w-100"
                          type="submit"
                          disabled={formik.isSubmitting}
                        >
                          {formik.isSubmitting ? (
                            <div className="d-flex align-items-center justify-content-center">
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Chargement...
                                </span>
                              </div>
                              <span>Chargement...</span>
                            </div>
                          ) : (
                            "Se connecter"
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Login;
