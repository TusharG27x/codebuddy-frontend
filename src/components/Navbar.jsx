// src/components/Navbar.jsx
import API_URL from "../apiConfig";
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function AppNavbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Call the backend endpoint to clear the cookie
      await axios.post(
        `${API_URL}/api/users/logout`,
        {},
        { withCredentials: true },
      );

      // Clear the global state and localStorage
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar expand="lg" bg="white" variant="light" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")} // Always go to Home page now!
          className="fw-bold text-primary"
          style={{ cursor: "pointer" }}
        >
          CodeBuddy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {userInfo ? (
              // --- Show these links if user is LOGGED IN ---
              <>
                <Nav.Link onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/editor")}>Editor</Nav.Link>
                <NavDropdown
                  title={<span>👤 {userInfo.name}</span>}
                  id="user-dropdown"
                  align="end"
                  className="ms-2"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              // --- Show these links if user is LOGGED OUT ---
              <>
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate("/signup")}>Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
