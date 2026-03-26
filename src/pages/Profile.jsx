// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Container,
} from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../apiConfig";

function Profile() {
  const { userInfo, login } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/api/dashboard/stats`, {
            withCredentials: true,
          }),
        ]);

        setName(profileRes.data.name);
        setBio(profileRes.data.bio || "");
        setStats(statsRes.data);
        setLoadingProfile(false);
      } catch (error) {
        toast.error("Could not load profile data.");
        console.error("Fetch profile error:", error);
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, bio },
        { withCredentials: true },
      );
      login(data); // This updates the global state (and userInfo in the navbar)
      toast.success("Profile updated successfully!");
      setIsSaving(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile.");
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    toast.info("Profile picture uploads are a feature coming soon!");
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    toast.info("Profile picture uploads are a feature coming soon!");
    setProfilePic(null);
  };

  const getInitial = (nameStr, emailStr) => {
    if (nameStr && nameStr.length > 0) return nameStr.charAt(0).toUpperCase();
    if (emailStr) return emailStr.charAt(0).toUpperCase();
    return "?";
  };

  if (loadingProfile || !stats) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="ms-3 mt-3 fw-semibold text-secondary">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-4 border-0 shadow-sm rounded-4 profile-card bg-white">
              {/* Profile Picture Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="rounded-circle border profile-avatar shadow-sm"
                      width="120"
                      height="120"
                      style={{
                        objectFit: "cover",
                        transition: "all 0.3s ease-in-out",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm mx-auto"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitial(userInfo.name, userInfo.email)}
                    </div>
                  )}
                  <label
                    htmlFor="upload-photo"
                    className="btn btn-sm btn-light border position-absolute"
                    style={{
                      bottom: "5px",
                      right: "5px",
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <FaCamera className="text-primary" />
                  </label>
                  <input
                    type="file"
                    id="upload-photo"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </div>

                <h3
                  className="fw-bolder mt-3 mb-1"
                  style={{ color: "#1e293b" }}
                >
                  {userInfo.name}
                </h3>
                <p className="text-secondary fw-medium mb-1">
                  {userInfo.email}
                </p>

                {profilePic && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="mt-2 fw-semibold rounded-pill px-3"
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>

              <hr className="text-muted opacity-25" />

              {/* Edit Profile Form */}
              <Form className="px-md-3">
                <Form.Group className="mb-4 text-start">
                  <Form.Label className="fw-bold text-secondary mb-2">
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-light border-0 shadow-none py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4 text-start">
                  <Form.Label className="fw-bold text-secondary mb-2">
                    Bio
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us something about yourself..."
                    className="bg-light border-0 shadow-none py-2"
                    style={{ resize: "none" }}
                  />
                </Form.Group>

                <div className="text-center mt-2 mb-4">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 fw-bold shadow-sm rounded-pill"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>

              <hr className="text-muted opacity-25 mt-2 mb-4" />

              {/* User Stats Section - Enterprise Style */}
              <Row className="text-center g-3 px-md-2">
                <Col xs={4}>
                  <div className="bg-success-subtle rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                    <h6
                      className="text-success fw-bold mb-1"
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Solved
                    </h6>
                    <h4 className="fw-bolder text-success mb-0">
                      {stats.problemsSolved}
                    </h4>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-warning-subtle rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                    <h6
                      className="text-warning-emphasis fw-bold mb-1"
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Streak
                    </h6>
                    <h4 className="fw-bolder text-warning-emphasis mb-0">
                      {stats.currentStreak} <span className="fs-5">🔥</span>
                    </h4>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-info-subtle rounded-3 p-3 h-100 d-flex flex-column justify-content-center">
                    <h6
                      className="text-info-emphasis fw-bold mb-1"
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Rank
                    </h6>
                    <h4 className="fw-bolder text-info-emphasis mb-0">
                      #{stats.rank}
                    </h4>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
