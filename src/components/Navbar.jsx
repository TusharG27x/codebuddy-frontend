// src/components/Navbar.jsx
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="white" variant="light" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="fw-bold text-primary"
          style={{ cursor: "pointer" }}
        >
          CodeBuddy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/editor")}>Editor</Nav.Link>

            {!currentUser ? (
              <>
                <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate("/signup")}>Signup</Nav.Link>
              </>
            ) : (
              <NavDropdown
                title={
                  <span>
                    👤 {currentUser.name || currentUser.email.split("@")[0]}
                  </span>
                }
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
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
