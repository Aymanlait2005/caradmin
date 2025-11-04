import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
  Alert,
  Modal,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

// Images par défaut
import profileBg from "../assets/images/profile-bg.jpg";
import avatar1 from "../assets/images/users/avatar-1.jpg";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");

  // --- États utilisateur ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [cin, setCin] = useState("");

  // --- États mot de passe ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- États images ---
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(avatar1);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // --- États vendeur ---
  const [vendorName, setVendorName] = useState("");
  const [vendorPhoneNumber, setVendorPhoneNumber] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorDescription, setVendorDescription] = useState("");

  // --- Fichiers vendeur ---
  const [vendorCoverFile, setVendorCoverFile] = useState(null);
  const [vendorCoverPreview, setVendorCoverPreview] = useState(profileBg);
  const [vendorLogoFile, setVendorLogoFile] = useState(null);
  const [vendorLogoPreview, setVendorLogoPreview] = useState(null);
  const [vendorContractFile, setVendorContractFile] = useState(null);
  const [currentContractUrl, setCurrentContractUrl] = useState(null);
  const [currentContractName, setCurrentContractName] = useState(null);

  const vendorCoverInputRef = useRef(null);
  const vendorLogoInputRef = useRef(null);
  const vendorContractInputRef = useRef(null);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  // --- Chargement des données utilisateur ---
  useEffect(() => {
    const fetchUserData = () => {
      const userString = localStorage.getItem("user");

      if (userString) {
        try {
          const authUser = JSON.parse(userString);
          setUser(authUser);

          // --- Infos de base ---
          setFirstName(authUser?.first_name || "");
          setLastName(authUser?.last_name || "");
          setEmail(authUser?.email || "");
          setPhone1(authUser?.phone1 || "");
          setPhone2(authUser?.phone2 || "");
          setCin(authUser?.identity_piece_number || "");

          // --- Photo profil ---
          setProfileImagePreview(authUser?.photo_url || avatar1);

          // --- Si vendeur ---
          if (authUser.user_type === "Vendor" && authUser.vendor_info) {
            const v = authUser.vendor_info;
            setVendorName(v?.vendor_name || "");
            setVendorPhoneNumber(v?.vendor_phonenumber || "");
            setVendorAddress(v?.vendor_adresse || "");
            setVendorDescription(v?.vendor_description || "");
            setVendorCoverPreview(v?.vendor_photo_url || profileBg);
            setVendorLogoPreview(v?.vendor_logo_url || null);
            setCurrentContractUrl(v?.contract_url || null);
            setCurrentContractName(
              v?.contract_url ? v.contract_url.split("/").pop() : null
            );
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error);
          toast.error("Erreur de lecture des données utilisateur.");
        }
      } else {
        toast.warn("Aucun utilisateur trouvé, veuillez vous reconnecter.");
      }
    };

    fetchUserData();
  }, []);

  // --- Gestion photo profil ---
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
    setProfileImageFile(croppedBlob);
    setProfileImagePreview(URL.createObjectURL(croppedBlob));
    setShowCropModal(false);
  };

  // --- Gestion images vendeur ---
  const handleVendorCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVendorCoverFile(file);
      setVendorCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleVendorLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVendorLogoFile(file);
      setVendorLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleVendorContractChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVendorContractFile(file);
      setCurrentContractName(file.name);
      setCurrentContractUrl(null);
    }
  };

  // --- Mise à jour du profil ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      if (!token) {
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        return;
      }

      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone1", phone1);
      formData.append("phone2", phone2);
      formData.append("identity_piece_number", cin);

      if (profileImageFile)
        formData.append("photo", profileImageFile, "profile_" + Date.now() + ".jpg");

      // Si vendeur
      if (user?.user_type === "Vendor" && user?.vendor_info) {
        formData.append("vendor_name", vendorName);
        formData.append("vendor_phonenumber", vendorPhoneNumber);
        formData.append("vendor_adresse", vendorAddress);
        formData.append("vendor_description", vendorDescription);

        if (vendorCoverFile)
          formData.append("vendor_cover", vendorCoverFile, "cover_" + Date.now() + ".jpg");
        if (vendorLogoFile)
          formData.append("vendor_logo", vendorLogoFile, "logo_" + Date.now() + ".jpg");
        if (vendorContractFile)
          formData.append("contract", vendorContractFile, "contract_" + Date.now() + ".pdf");
      }

      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      

      if (data.status === true) {
        toast.success("Profil mis à jour avec succès !");
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur API:", error);
      toast.error(error.response?.data?.message || "Erreur de mise à jour.");
    }
  };
  

  // --- Changement de mot de passe ---
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.status === true) {
        toast.success(data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Erreur inattendue.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Échec du changement de mot de passe.");
    }
  };

  document.title = "Paramètres de profil | RENTAL 365";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* === En-tête avec image de couverture === */}
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img
                src={vendorCoverPreview}
                className="profile-wid-img"
                alt="Couverture de la société"
              />
              <div className="overlay-content text-end p-3">
                <Input
                  id="vendor-cover-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleVendorCoverChange}
                  innerRef={vendorCoverInputRef}
                  hidden
                />
                <Label htmlFor="vendor-cover-file-input" className="btn btn-light">
                  <i className="ri-image-edit-line me-1"></i> Changer la couverture
                </Label>
              </div>
            </div>
          </div>
  
          {/* === Profil utilisateur principal === */}
          <Row className="g-4 mb-4">
            <Col lg={12}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="position-relative d-inline-block">
                      <img
                        src={profileImagePreview}
                        alt="Profil"
                        className="avatar-lg rounded-circle img-thumbnail"
                      />
                      <Input
                        id="profile-img-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        hidden
                      />
                      <Label
                        htmlFor="profile-img-file-input"
                        className="position-absolute bottom-0 end-0 bg-light p-1 rounded-circle"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-pencil-line"></i>
                      </Label>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-1">{firstName} {lastName}</h5>
                      <p className="text-muted mb-0">{email}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
  
          {/* === Onglets de navigation === */}
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-success mb-3">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => tabChange("1")}
                  >
                    <i className="ri-user-3-line me-1"></i> Informations personnelles
                  </NavLink>
                </NavItem>
  
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => tabChange("2")}
                  >
                    <i className="ri-lock-2-line me-1"></i> Mot de passe
                  </NavLink>
                </NavItem>
              </Nav>
  
              <TabContent activeTab={activeTab}>
                {/* === Onglet 1 : Informations personnelles === */}
                <TabPane tabId="1">
                  <Form onSubmit={handleUpdate}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Prénom</Label>
                          <Input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Votre prénom"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Nom</Label>
                          <Input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Votre nom"
                          />
                        </div>
                      </Col>
  
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre email"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>CIN</Label>
                          <Input
                            type="text"
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            placeholder="Numéro de CIN"
                          />
                        </div>
                      </Col>
  
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Téléphone 1</Label>
                          <Input
                            type="text"
                            value={phone1}
                            onChange={(e) => setPhone1(e.target.value)}
                            placeholder="+212..."
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Téléphone 2</Label>
                          <Input
                            type="text"
                            value={phone2}
                            onChange={(e) => setPhone2(e.target.value)}
                            placeholder="Optionnel"
                          />
                        </div>
                      </Col>
  
                      {user?.user_type === "Vendor" && (
                        <>
                          <Col md={12}>
                            <h5 className="mt-3">Informations de la société</h5>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label>Nom de la société</Label>
                              <Input
                                type="text"
                                value={vendorName}
                                onChange={(e) => setVendorName(e.target.value)}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label>Téléphone société</Label>
                              <Input
                                type="text"
                                value={vendorPhoneNumber}
                                onChange={(e) => setVendorPhoneNumber(e.target.value)}
                              />
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className="mb-3">
                              <Label>Adresse</Label>
                              <Input
                                type="text"
                                value={vendorAddress}
                                onChange={(e) => setVendorAddress(e.target.value)}
                              />
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className="mb-3">
                              <Label>Description</Label>
                              <Input
                                type="textarea"
                                rows="3"
                                value={vendorDescription}
                                onChange={(e) => setVendorDescription(e.target.value)}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <Label>Logo de la société</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleVendorLogoChange}
                            />
                            {vendorLogoPreview && (
                              <img
                                src={vendorLogoPreview}
                                alt="Logo société"
                                className="mt-2 rounded"
                                style={{ width: 100, height: 100, objectFit: "cover" }}
                              />
                            )}
                          </Col>
                          <Col md={6}>
                            <Label>Contrat</Label>
                            <Input
                              type="file"
                              accept="application/pdf"
                              onChange={handleVendorContractChange}
                            />
                            {currentContractName && (
                              <p className="mt-2 text-muted small">
                                Fichier actuel :{" "}
                                {currentContractUrl ? (
                                  <a
                                    href={currentContractUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {currentContractName}
                                  </a>
                                ) : (
                                  currentContractName
                                )}
                              </p>
                            )}
                          </Col>
                        </>
                      )}
                    </Row>
                    <div className="text-end">
                      <Button color="primary" type="submit">
                        <i className="ri-save-3-line me-1"></i> Enregistrer
                      </Button>
                    </div>
                  </Form>
                </TabPane>
  
                {/* === Onglet 2 : Mot de passe === */}
                <TabPane tabId="2">
                  <Form onSubmit={handleChangePassword}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Ancien mot de passe</Label>
                          <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Ancien mot de passe"
                          />
                        </div>
                      </Col>
                      <Col md={6}></Col>
  
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Nouveau mot de passe</Label>
                          <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label>Confirmer le mot de passe</Label>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmez le mot de passe"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button color="primary" type="submit">
                        <i className="ri-lock-password-line me-1"></i> Mettre à jour
                      </Button>
                    </div>
                  </Form>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </div>
  
      {/* === Modal de recadrage photo === */}
      <Modal isOpen={showCropModal} toggle={() => setShowCropModal(false)} centered size="lg">
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          {imageToCrop && (
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
          )}
        </div>
        <div className="d-flex justify-content-end gap-2 p-3">
          <Button color="secondary" onClick={() => setShowCropModal(false)}>
            Annuler
          </Button>
          <Button color="primary" onClick={handleCropComplete}>
            Valider
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
  
};

export default Settings;
