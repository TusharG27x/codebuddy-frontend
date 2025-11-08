// src/pages/Profile.jsx
import API_URL from "../apiConfig";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";

// --- 1. Imports for API and State ---
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function Profile() {
  // --- 2. Get user info and 'login' (which we use to update) from context ---
  const { userInfo, login } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null); // Keep UI state for pic

  // --- 3. Loading states ---
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 4. Fetch Profile Data on Load ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/users/profile`,
          { withCredentials: true } // This sends our auth cookie
        );

        // Populate state with data from the database
        setName(data.name);
        setBio(data.bio || ""); // Use default if bio is null
        // setProfilePic(data.profilePic); // We'll add this feature later
        setLoadingProfile(false);
      } catch (error) {
        toast.error("Could not load profile data.");
        console.error("Fetch profile error:", error);
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty array means this runs once when the component mounts

  // --- 5. Update Profile Data on Save ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, bio }, // Send updated name and bio
        { withCredentials: true }
      );

      // --- 6. Update the global state ---
      // We re-use our 'login' function from context to update
      // the global state and localStorage with the new user data.
      login(data);

      toast.success("Profile updated successfully!");
      setIsSaving(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile.");
      console.error("Save profile error:", error);
      setIsSaving(false);
    }
  };

  // --- 7. Deferring profile pic logic for now ---
  const handleImageUpload = (e) => {
    toast.info("Profile picture uploads are a feature coming soon!");
    // This UI-only part still shows the user their selection
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

  // Helper function for the avatar initial
  const getInitial = (nameStr, emailStr) => {
    if (nameStr && nameStr.length > 0) return nameStr.charAt(0).toUpperCase();
    if (emailStr) return emailStr.charAt(0).toUpperCase();
    return "?";
  };

  // --- 8. Show a loading spinner ---
  if (loadingProfile) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Loading your profile...</p>
      </div>
    );
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
            {/* Profile Picture Section (UI is unchanged) */}
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

              {/* --- 9. Use 'userInfo' for non-editable fields --- */}
              <h4 className="fw-bold text-primary mt-3 mb-1">
                {userInfo.name}
              </h4>
              <p className="text-muted mb-1">{userInfo.email}</p>

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
                {/* --- 10. Update Save Button with loading state --- */}
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Form>

            <hr className="mt-4" />

            {/* User Stats Section (Still hard-coded for now) */}
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
