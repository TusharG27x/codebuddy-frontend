// src/pages/Login.jsx
import API_URL from "../apiConfig";
import React, { useState } from "react";
import { Form, Button, Card, Container, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- 1. Imports for our API logic ---
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // --- 2. Add loading state and get auth context ---
  const [loading, setLoading] = useState(false);
  const auth = useAuth(); // Get login function from our context

  // --- 3. This is the updated login handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // 4. Call our backend API
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true } // CRITICAL: This sends the auth cookie
      );

      // 5. On success, update global state
      auth.login(response.data); // This updates context and localStorage
      toast.success(`Welcome back, ${response.data.name}! 🚀`);
      navigate("/dashboard");
    } catch (err) {
      // 6. On failure, show an error toast
      const message =
        err.response?.data?.message || "Invalid email or password!";
      toast.error(message);
      setLoading(false); // Stop loading
    }
  };

  // --- 7. "Forgot Password" logic remains unchanged for now ---
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
                  {/* ... (email input - no change) ... */}
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  {/* ... (password input - no change) ... */}
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="text-end mb-3">
                  {/* ... (forgot password link - no change) ... */}
                  <span
                    className="text-primary small"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowReset(true)}
                  >
                    Forgot Password?
                  </span>
                </div>

                {/* --- 8. Update Button for loading state --- */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-muted mb-0">
                  {/* ... (signup link - no change) ... */}
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

      {/* --- Forgot Password Modal (no change) --- */}
      <Modal show={showReset} onHide={() => setShowReset(false)} centered>
        {/* ... (rest of your modal code) ... */}
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
