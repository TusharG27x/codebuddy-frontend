// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../apiConfig"; // <-- This should be here

function Profile() {
  const { userInfo, login } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. ADD STATE FOR STATS ---
  const [stats, setStats] = useState(null);

  // --- 2. UPDATE USEEFFECT TO FETCH BOTH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile and stats at the same time
        const [profileRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/api/dashboard/stats`, {
            withCredentials: true,
          }),
        ]);

        // Set profile data
        setName(profileRes.data.name);
        setBio(profileRes.data.bio || "");

        // Set stats data
        setStats(statsRes.data);

        setLoadingProfile(false);
      } catch (error) {
        toast.error("Could not load profile data.");
        console.error("Fetch profile error:", error);
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, []); // Runs once on mount

  // --- (handleSave function is unchanged) ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, bio },
        { withCredentials: true }
      );
      login(data);
      toast.success("Profile updated successfully!");
      setIsSaving(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile.");
      setIsSaving(false);
    }
  };

  // --- (Other functions are unchanged) ---
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

  // --- 3. UPDATE LOADING SPINNER ---
  if (loadingProfile || !stats) {
    // Wait for profile AND stats
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

  // --- (Rest of the JSX is mostly the same) ---
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
            {/* ... (Profile Picture Section is unchanged) ... */}
            <div className="text-center mb-4">
              {/* ... (image/initial div) ... */}
              <h4 className="fw-bold text-primary mt-3 mb-1">
                {userInfo.name}
              </h4>
              <p className="text-muted mb-1">{userInfo.email}</p>
              {/* ... (remove photo button) ... */}
            </div>

            <hr />

            {/* ... (Edit Info Section is unchanged) ... */}
            <Form>
              {/* ... (name and bio forms) ... */}
              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>

            <hr className="mt-4" />

            {/* --- 4. UPDATE USER STATS SECTION --- */}
            <Row className="text-center">
              <Col>
                <h6 className="text-muted">Problems Solved</h6>
                <h5 className="fw-bold text-success">{stats.problemsSolved}</h5>
              </Col>
              <Col>
                <h6 className="text-muted">Current Streak</h6>
                <h5 className="fw-bold text-warning">
                  {stats.currentStreak} days 🔥
                </h5>
              </Col>
              <Col>
                <h6 className="text-muted">Rank</h6>
                <h5 className="fw-bold text-info">#{stats.rank}</h5>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
