// src/pages/Login.jsx
import API_URL from "../apiConfig";
import React, { useState } from "react";
import { Form, Button, Card, Container, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- Imports for our API logic ---
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true },
      );

      auth.login(response.data);
      toast.success(`Welcome back, ${response.data.name}! 🚀`);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password!";
      toast.error(message);
      setLoading(false);
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
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <Container
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            className="p-4 shadow-sm border-0 rounded-4"
            style={{ width: "380px" }}
          >
            <Card.Body>
              <h3
                className="text-center mb-4 fw-bolder"
                style={{ color: "#1e293b" }}
              >
                Login to CodeBuddy
              </h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3 text-start">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="py-2 bg-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-2 text-start">
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-2 bg-light border-0"
                  />
                </Form.Group>

                <div className="text-end mb-4">
                  <span
                    className="text-primary small fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowReset(true)}
                  >
                    Forgot Password?
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-4 py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-secondary mb-0">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary fw-bold"
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
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold" style={{ color: "#1e293b" }}>
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-secondary">
                Registered Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="bg-light border-0"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-light border-0"
              />
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 py-2 fw-bold"
              onClick={handlePasswordReset}
            >
              Update Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
