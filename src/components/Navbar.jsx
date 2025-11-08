// src/components/Navbar.jsx
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth
import axios from "axios"; // 2. Import axios
import toast from "react-hot-toast";

function AppNavbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth(); // 3. Use auth context

  // 4. Update the logout handler
  const handleLogout = async () => {
    try {
      // Call the backend endpoint to clear the cookie
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
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
          onClick={() => navigate(userInfo ? "/dashboard" : "/")} // Go to dashboard if logged in
          className="fw-bold text-primary"
          style={{ cursor: "pointer" }}
        >
          CodeBuddy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* 5. Update conditional rendering logic */}
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
