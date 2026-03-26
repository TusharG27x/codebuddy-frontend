// src/pages/Signup.jsx
import API_URL from "../apiConfig";
import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- Imports for our API logic ---
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        { name, email, password },
        { withCredentials: true },
      );

      auth.login(response.data);
      toast.success(`Welcome to CodeBuddy, ${response.data.name}! 🚀`);
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed!";
      toast.error(message);
      setLoading(false);
    }
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
                Create Account
              </h3>
              <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3 text-start">
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="py-2 bg-light border-0"
                  />
                </Form.Group>

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

                <Form.Group className="mb-3 text-start">
                  <Form.Control
                    type="password"
                    placeholder="Enter password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-2 bg-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-4 text-start">
                  <Form.Control
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="py-2 bg-light border-0"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-4 py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-center text-secondary mb-0">
                  Already have an account?{" "}
                  <span
                    className="text-primary fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default Signup;
