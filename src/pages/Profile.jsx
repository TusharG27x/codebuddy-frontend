// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || "");
      setBio(currentUser.bio || "");
      setProfilePic(currentUser.profilePic || null);
    }
  }, []);

  const handleSave = () => {
    if (!user) return;

    const updatedUser = { ...user, name, bio, profilePic };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) => (u.email === user.email ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Profile updated successfully!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePic(null);
    if (user) {
      const updatedUser = { ...user, profilePic: null };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.map((u) => (u.email === user.email ? updatedUser : u));
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const getInitial = (name, email) => {
    if (name && name.length > 0) return name.charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  if (!user) {
    return <p className="text-center mt-5">⚠️ No user logged in.</p>;
  }

  return (
    <div className="container mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card
            className="p-4 border-0 shadow-lg rounded-4 profile-card"
            style={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
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
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "120px",
                      height: "120px",
                      fontSize: "2rem",
                      transition: "background 0.3s ease",
                    }}
                  >
                    {getInitial(user.name, user.email)}
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

              <h4 className="fw-bold text-primary mt-3 mb-1">
                {user.name || "Your Name"}
              </h4>
              <p className="text-muted mb-1">{user.email}</p>

              {profilePic && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={handleRemovePhoto}
                >
                  Remove Photo
                </Button>
              )}
            </div>

            <hr />

            {/* Edit Info Section */}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us something about yourself..."
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </Form>

            <hr className="mt-4" />

            {/* User Stats Section */}
            <Row className="text-center">
              <Col>
                <h6 className="text-muted">Problems Solved</h6>
                <h5 className="fw-bold text-success">28</h5>
              </Col>
              <Col>
                <h6 className="text-muted">Current Streak</h6>
                <h5 className="fw-bold text-warning">5 days 🔥</h5>
              </Col>
              <Col>
                <h6 className="text-muted">Rank</h6>
                <h5 className="fw-bold text-info">#12</h5>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
