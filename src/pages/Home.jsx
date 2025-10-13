// src/pages/Home.jsx
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaRobot, FaLightbulb, FaChartLine, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.div
        className="hero-section text-center text-light d-flex flex-column justify-content-center align-items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="fw-bold display-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Welcome to <span className="text-warning">CodeBuddy</span>
        </motion.h1>

        <motion.p
          className="lead mt-3 w-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Your personal <strong>AI-powered coding assistant</strong> — designed
          to help you solve problems smarter, not harder! Get hints, debug your
          code, and learn efficiently.
        </motion.p>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Button
            variant="warning"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
          <Button
            variant="outline-light"
            size="lg"
            className="ms-3"
            onClick={() => navigate("/dashboard")}
          >
            Explore Dashboard
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <Container id="features" className="my-5">
        <motion.h2
          className="text-center fw-bold mb-4 text-primary"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Why Choose CodeBuddy?
        </motion.h2>

        <Row className="g-4">
          {[
            {
              icon: <FaLightbulb className="display-5 text-warning mb-3" />,
              title: "Smart Hints",
              text: "Get AI-generated hints without spoiling the solution.",
            },
            {
              icon: <FaCode className="display-5 text-info mb-3" />,
              title: "Code Debugging",
              text: "Let CodeBuddy analyze and suggest fixes for your code.",
            },
            {
              icon: <FaChartLine className="display-5 text-success mb-3" />,
              title: "Progress Tracking",
              text: "Track your growth with charts and analytics.",
            },
            {
              icon: <FaRobot className="display-5 text-danger mb-3" />,
              title: "AI Learning Partner",
              text: "Learn interactively and get instant feedback.",
            },
          ].map((feature, index) => (
            <Col md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-sm text-center p-3 border-0 feature-card">
                  {feature.icon}
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.text}</Card.Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How it Works Section */}
      <motion.div
        id="how-it-works"
        className="how-it-works py-5 bg-light"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Container>
          <h2 className="text-center fw-bold mb-4 text-primary">
            How It Works
          </h2>
          <Row className="justify-content-center">
            <Col md={10}>
              <ol className="list-group list-group-numbered shadow-sm">
                <li className="list-group-item">
                  Login or Sign Up to your CodeBuddy account.
                </li>
                <li className="list-group-item">
                  Paste your coding problem or upload your code.
                </li>
                <li className="list-group-item">
                  Select what kind of help you need — Hint, Debug, or Concept
                  Explanation.
                </li>
                <li className="list-group-item">
                  AI analyzes and gives guided feedback.
                </li>
                <li className="list-group-item">
                  Improve your code and track progress over time.
                </li>
              </ol>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Footer */}
      <motion.footer
        id="footer"
        className="bg-dark text-light text-center py-4 mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="mb-1">
          © {new Date().getFullYear()} CodeBuddy | All Rights Reserved
        </p>
        <small>Made with ❤️ by Tushar and Team</small>
      </motion.footer>
    </div>
  );
}

export default Home;
