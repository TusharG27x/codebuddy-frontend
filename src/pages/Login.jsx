// src/pages/Login.jsx
import React, { useState } from "react";
import { Form, Button, Card, Container, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login successful! 🚀");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password!");
    }
  };

  const handlePasswordReset = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === resetEmail);

    if (userIndex === -1) {
      toast.error("Email not found!");
      return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Password reset successfully!");
    setShowReset(false);
    setResetEmail("");
    setNewPassword("");
  };

  return (
    <>
      <Container
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-4 shadow-sm border-0" style={{ width: "380px" }}>
            <Card.Body>
              <h3 className="text-center mb-4 text-primary fw-bold">
                Login to CodeBuddy
              </h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="text-end mb-3">
                  <span
                    className="text-primary small"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowReset(true)}
                  >
                    Forgot Password?
                  </span>
                </div>

                <Button type="submit" variant="primary" className="w-100 mb-3">
                  Login
                </Button>

                <p className="text-center text-muted mb-0">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </span>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Forgot Password Modal */}
      <Modal show={showReset} onHide={() => setShowReset(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Registered Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="success"
              className="w-100"
              onClick={handlePasswordReset}
            >
              Update Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
