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
  import React, { useState, useEffect, useRef } from "react";
  import axios from "axios";
  import { toast } from "react-toastify";
  import Cropper from "react-easy-crop";
  
  import progileBg from "../assets/images/profile-bg.jpg";
  import avatar1 from "../assets/images/users/avatar-1.jpg";
  
  const Settings = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [user, setUser] = useState({});
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }, []);
  
    // --- États du profil utilisateur ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [cin, setCin] = useState("");
  
    // --- États du mot de passe ---
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    // --- États pour les images ---
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(avatar1);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    // --- Données du vendeur ---
    const [vendorName, setVendorName] = useState("");
    const [vendorPhoneNumber, setVendorPhoneNumber] = useState("");
    const [vendorAddress, setVendorAddress] = useState("");
    const [vendorDescription, setVendorDescription] = useState("");
  
    // --- Fichiers du vendeur ---
    const [vendorCoverFile, setVendorCoverFile] = useState(null);
    const [vendorCoverPreview, setVendorCoverPreview] = useState(progileBg);
    const [vendorLogoFile, setVendorLogoFile] = useState(null);
    const [vendorLogoPreview, setVendorLogoPreview] = useState(null);
    const [vendorContractFile, setVendorContractFile] = useState(null);
    const [currentContractUrl, setCurrentContractUrl] = useState(null);
    const [currentContractName, setCurrentContractName] = useState(null);
  
    // --- Références ---
    const vendorCoverInputRef = useRef(null);
    const vendorLogoInputRef = useRef(null);
    const vendorContractInputRef = useRef(null);
  
    // --- Changement d’onglet ---
    const tabChange = (tab) => {
      if (activeTab !== tab) setActiveTab(tab);
    };
  
    // --- Récupération des données utilisateur ---
    const fetchUserData = () => {
      const authUserString = localStorage.getItem('user');
  
      if (authUserString) {
        try {
          const authUser = JSON.parse(authUserString);
          const userData = authUser;
          setUser(authUser);
          
          setFirstName(userData?.first_name || "");
          setLastName(userData?.last_name || "");
          setEmail(userData?.email || "");
          setPhone1(userData?.phone1 || "");
          setPhone2(userData?.phone2 || "");
          setCin(userData?.identity_piece_number || "");
          setProfileImagePreview(userData?.photo_url || avatar1);
          console.log(firstName)
          if (userData.user_type === "Vendor" && userData.vendor_info) {
            setVendorName(userData.vendor_info.vendor_name || "");
            setVendorPhoneNumber(userData.vendor_info.vendor_phonenumber || "");
            setVendorAddress(userData.vendor_info.vendor_adresse || "");
            setVendorDescription(userData.vendor_info.vendor_description || "");
            setVendorCoverPreview(userData.vendor_info.vendor_photo_url || progileBg);
            setVendorLogoPreview(userData.vendor_info.vendor_logo_url || null);
            setCurrentContractUrl(userData.vendor_info.contract_url || null);
            setCurrentContractName(
              userData.vendor_info.contract_url
                ? userData.vendor_info.contract_url.split("/").pop()
                : null
            );
          }
        } catch (error) {
          console.error("Erreur de chargement des données utilisateur:", error);
          toast.error("Erreur lors du chargement des données utilisateur.");
        }
      }
    };
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    // --- Gestion du changement de photo de profil ---
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
  
    // --- Générer l’image recadrée ---
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
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    };
  
    const handleCropComplete = async () => {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfileImageFile(croppedBlob);
      setProfileImagePreview(URL.createObjectURL(croppedBlob));
      setShowCropModal(false);
    };
  
    // --- Couverture / Logo / Contrat ---
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
        if (profileImageFile) formData.append("photo", profileImageFile);
  
        if (user?.user_type === "Vendor" && user?.vendor_info) {
          formData.append("vendor_name", vendorName);
          formData.append("vendor_phonenumber", vendorPhoneNumber);
          formData.append("vendor_adresse", vendorAddress);
          formData.append("vendor_description", vendorDescription);
          if (vendorCoverFile) formData.append("vendor_cover", vendorCoverFile);
          if (vendorLogoFile) formData.append("vendor_logo", vendorLogoFile);
          if (vendorContractFile) formData.append("contract", vendorContractFile);
        }
  
        const { data } =  axios.post(
          `http://127.0.0.1:8000/api/update-profile`,
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
          const oldAuthUser = JSON.parse(sessionStorage.getItem("authUser"));
          if (oldAuthUser) {
            const updatedAuthUser = { ...oldAuthUser, user: data.user };
            sessionStorage.setItem("authUser", JSON.stringify(updatedAuthUser));
          }
        } else {
          toast.error(data.message || "Erreur lors de la mise à jour du profil.");
        }
      } catch (error) {
        console.error("Erreur API:", error);
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la mise à jour du profil."
        );
      }
    };
  
    // --- Changement du mot de passe ---
    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }
  
      try {
        const { data } = await axios.post(
          `http://127.0.0.1:8000/api/change-password`,
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
        } else toast.error(data.message || "Erreur inattendue.");
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "Échec du changement de mot de passe."
        );
      }
    };
  
    document.title = "Paramètres de profil | RENTAL 365";
  
    return (
        <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <div className="position-relative mx-n4 mt-n4">
              <div className="profile-wid-bg profile-setting-img">
                <img
                  src={vendorCoverPreview || progileBg}
                  className="profile-wid-img"
                  alt="Couverture de la société"
                />
                <div className="overlay-content">
                  <div className="text-end p-3">
                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                      <Input
                        id="vendor-cover-file-input"
                        type="file"
                        className="profile-foreground-img-file-input"
                        onChange={handleVendorCoverChange}
                        accept="image/*"
                        innerRef={vendorCoverInputRef}
                      />
                      <Label
                        htmlFor="vendor-cover-file-input"
                        className="profile-photo-edit btn btn-light"
                      >
                        <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                        Changer la couverture
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Col xxl={3}>
                <Card className="mt-n5">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                        <img
                          src={profileImagePreview}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="Photo de profil"
                        />
                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                          <input
                            id="profile-img-file-input"
                            type="file"
                            className="profile-img-file-input"
                            onChange={handleProfileImageChange}
                            accept="image/*"
                          />
                          <label
                            htmlFor="profile-img-file-input"
                            className="profile-photo-edit avatar-xs"
                          >
                            <span className="avatar-title rounded-circle bg-light text-body">
                              <i className="ri-camera-fill"></i>
                            </span>
                          </label>
                        </div>
                      </div>
                      <h5 className="fs-16 mb-1">{firstName}</h5>
                      <p className="text-muted mb-0">Profil</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
  
              <Col xxl={9}>
                <Card className="mt-xxl-n5">
                  <CardHeader>
                    <Nav
                      className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            tabChange("1");
                          }}
                          type="button"
                        >
                          <i className="fas fa-home me-1"></i>
                          Détails personnels
                        </NavLink>
                      </NavItem>
  
                      {user &&
                        user.user_type === "Vendor" &&
                        user.vendor_info && (
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: activeTab === "3",
                              })}
                              onClick={() => {
                                tabChange("3");
                              }}
                              type="button"
                            >
                              <i className="fas fa-building me-1"></i>
                              Détails de la société
                            </NavLink>
                          </NavItem>
                        )}
  
                      <NavItem>
                        <NavLink
                          to="#"
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => {
                            tabChange("2");
                          }}
                          type="button"
                        >
                          <i className="far fa-user me-1"></i>
                          Modifier le mot de passe
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </CardHeader>
                  <CardBody className="p-4">
                    <TabContent activeTab={activeTab}>
                      {/* Détails personnels Tab */}
                      <TabPane tabId="1">
                        <Form onSubmit={handleUpdate}>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="firstnameInput"
                                  className="form-label"
                                >
                                  Prénom
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="firstnameInput"
                                  placeholder="Entrer votre prénom"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="lastnameInput"
                                  className="form-label"
                                >
                                  Nom
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="lastnameInput"
                                  placeholder="Entrer votre nom"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="phonenumberInput"
                                  className="form-label"
                                >
                                  Numéro de téléphone principal
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="phonenumberInput"
                                  placeholder="Entrer votre numéro de téléphone"
                                  value={phone1}
                                  onChange={(e) => setPhone1(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">
                                  Email
                                </Label>
                                <Input
                                  type="email"
                                  className="form-control"
                                  id="emailInput"
                                  placeholder="Entrer votre email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="cinInput"
                                  className="form-label"
                                >
                                  Numéro de CIN
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cinInput"
                                  placeholder="Entrer votre numéro de CIN"
                                  value={cin}
                                  onChange={(e) => setCin(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phone2" className="form-label">
                                  Numéro de téléphone secondaire
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="phone2"
                                  placeholder="Entrer un numéro de téléphone secondaire"
                                  value={phone2}
                                  onChange={(e) => setPhone2(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="hstack gap-2 justify-content-end">
                                <Button type="submit" color="primary">
                                  Enregistrer les modifications
                                </Button>
                                <Button type="button" color="soft-success">
                                  Annuler
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>
  
                      {/* Détails de la société Tab */}
                      <TabPane tabId="3">
                        {user?.user_type === "Vendor" && user?.vendor_info ? (
                          <Form onSubmit={handleUpdate}>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorNameInput"
                                    className="form-label"
                                  >
                                    Nom de la société
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="vendorNameInput"
                                    placeholder="Entrer le nom de la société"
                                    value={vendorName}
                                    onChange={(e) =>
                                      setVendorName(e.target.value)
                                    }
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorPhoneNumberInput"
                                    className="form-label"
                                  >
                                    Numéro de téléphone de la société
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="vendorPhoneNumberInput"
                                    placeholder="Entrer le numéro de téléphone de la société"
                                    value={vendorPhoneNumber}
                                    onChange={(e) =>
                                      setVendorPhoneNumber(e.target.value)
                                    }
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorAddressInput"
                                    className="form-label"
                                  >
                                    Adresse de la société
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="vendorAddressInput"
                                    placeholder="Entrer l'adresse de la société"
                                    value={vendorAddress}
                                    onChange={(e) =>
                                      setVendorAddress(e.target.value)
                                    }
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorDescriptionInput"
                                    className="form-label"
                                  >
                                    Description de la société
                                  </Label>
                                  <Input
                                    type="textarea"
                                    className="form-control"
                                    id="vendorDescriptionInput"
                                    rows="3"
                                    placeholder="Entrer la description de la société"
                                    value={vendorDescription}
                                    onChange={(e) =>
                                      setVendorDescription(e.target.value)
                                    }
                                  />
                                </div>
                              </Col>
  
                              {/* Vendor Logo Upload */}
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorLogoInput"
                                    className="form-label"
                                  >
                                    Logo de la société
                                  </Label>
                                  <Input
                                    type="file"
                                    className="form-control"
                                    id="vendorLogoInput"
                                    onChange={handleVendorLogoChange}
                                    accept="image/*"
                                    innerRef={vendorLogoInputRef}
                                  />
                                  {vendorLogoPreview && (
                                    <div className="mt-2 text-center">
                                      <img
                                        src={vendorLogoPreview}
                                        alt="Aperçu du logo"
                                        className="img-thumbnail"
                                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                                      />
                                    </div>
                                  )}
                                  {!vendorLogoPreview && user.vendor_info?.vendor_logo_url && (
                                    <div className="mt-2 text-center">
                                      <img
                                        src={user.vendor_info.vendor_logo_url}
                                        alt="Logo actuel"
                                        className="img-thumbnail"
                                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </Col>
  
                              {/* Vendor Contract Upload */}
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorContractInput"
                                    className="form-label"
                                  >
                                    Contrat de la société (PDF)
                                  </Label>
                                  <Input
                                    type="file"
                                    className="form-control"
                                    id="vendorContractInput"
                                    onChange={handleVendorContractChange}
                                    accept="application/pdf"
                                    innerRef={vendorContractInputRef}
                                  />
                                  {(currentContractName || currentContractUrl) && (
                                    <div className="mt-2">
                                      <p className="mb-0">
                                        Contrat actuel:{" "}
                                        {vendorContractFile ? (
                                          <strong>{currentContractName}</strong>
                                        ) : (
                                          <a
                                            href={currentContractUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {currentContractName || "Voir le contrat"}
                                          </a>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </Col>
  
                              <Col lg={12}>
                                <div className="hstack gap-2 justify-content-end">
                                  <Button type="submit" color="primary">
                                    Enregistrer les modifications de la société
                                  </Button>
                                  <Button type="button" color="soft-success">
                                    Annuler
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        ) : (
                          <Alert color="info">
                            Vous n'êtes pas autorisé à modifier les détails de
                            cette société.
                          </Alert>
                        )}
                      </TabPane>
  
                      {/* Modifier le mot de passe Tab */}
                      <TabPane tabId="2">
                        <Form onSubmit={handleChangePassword}>
                          <Row className="g-2">
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="oldpasswordInput"
                                  className="form-label"
                                >
                                  Ancien mot de passe*
                                </Label>
                                <Input
                                  type="password"
                                  className="form-control"
                                  id="oldpasswordInput"
                                  placeholder="Entrez le mot de passe actuel"
                                  value={oldPassword}
                                  onChange={(e) => setOldPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </Col>
  
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="newpasswordInput"
                                  className="form-label"
                                >
                                  Nouveau mot de passe*
                                </Label>
                                <Input
                                  type="password"
                                  className="form-control"
                                  id="newpasswordInput"
                                  placeholder="Entrez le nouveau mot de passe"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </Col>
  
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="confirmpasswordInput"
                                  className="form-label"
                                >
                                  Confirmer le mot de passe*
                                </Label>
                                <Input
                                  type="password"
                                  className="form-control"
                                  id="confirmpasswordInput"
                                  placeholder="Confirmez le mot de passe"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </Col>
  
                            <Col lg={12}>
                              <div className="mb-3">
                                <Button type="submit" color="success">
                                  Changer le mot de passe
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
  
        {/* Crop Image Modal for User Profile Photo */}
        <Modal isOpen={showCropModal} toggle={() => setShowCropModal(false)} centered size="lg">
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1} // Square aspect ratio for profile photos
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
  