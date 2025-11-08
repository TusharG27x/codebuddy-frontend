// src/pages/Signup.jsx
import API_URL from "../apiConfig";
import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- 1. Imports for our API logic ---
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Signup() {
  // --- 2. Add 'name' and 'loading' states ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // For button

  const navigate = useNavigate();
  const auth = useAuth(); // Get auth context

  // --- 3. This is the updated signup handler ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- 4. Keep your existing validation ---
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

    // --- 5. Call our backend API ---
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        { name, email, password }, // Send name, email, and password
        { withCredentials: true } // This will log them in right away
      );

      // --- 6. On success, log them in and go to dashboard ---
      auth.login(response.data);
      toast.success(`Welcome to CodeBuddy, ${response.data.name}! 🚀`);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      // --- 7. On failure, show an error from the backend ---
      const message = err.response?.data?.message || "Registration failed!";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
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
              Create Your CodeBuddy Account
            </h3>
            <Form onSubmit={handleSignup}>
              {/* --- 8. Add the new "Name" field --- */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* --- 9. Update Button for loading state --- */}
              <Button
                type="submit"
                variant="primary"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-center text-muted mb-0">
                Already have an account?{" "}
                <span
                  className="text-primary fw-semibold"
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
  );
}

export default Signup;
