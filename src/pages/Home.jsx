// src/pages/Home.jsx
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaLightbulb,
  FaCode,
  FaChartLine,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaBrain,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="home-page bg-light text-dark"
      style={{ minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* SECTION 1: Clean Enterprise Hero */}
      <div className="bg-white border-bottom py-5">
        <Container>
          <Row className="align-items-center" style={{ minHeight: "75vh" }}>
            <Col lg={6} className="text-center text-lg-start pe-lg-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
                  Intelligent Tutoring System
                </span>
                <h1
                  className="fw-bolder display-4 mb-4"
                  style={{ color: "#1e293b" }}
                >
                  Learn the Logic. <br />
                  <span className="text-primary">Master the Code.</span>
                </h1>
                <p className="lead text-secondary mb-5 fs-4">
                  CodeBuddy is an AI-driven educational tool designed to help
                  students debug their code through conceptual hints, rather
                  than direct answers.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-5 py-3 fw-semibold shadow-sm"
                    onClick={() => navigate("/login")}
                  >
                    Start Debugging
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="px-5 py-3 fw-semibold bg-white"
                    onClick={() => navigate("/dashboard")}
                  >
                    View Dashboard
                  </Button>
                </div>
              </motion.div>
            </Col>

            <Col lg={6} className="d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Professional Abstract Graphic/Placeholder */}
                <div className="hero-graphic shadow-lg rounded-4 p-4 bg-light border">
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <div
                      className="rounded-circle bg-danger me-2"
                      style={{ width: "12px", height: "12px" }}
                    ></div>
                    <div
                      className="rounded-circle bg-warning me-2"
                      style={{ width: "12px", height: "12px" }}
                    ></div>
                    <div
                      className="rounded-circle bg-success"
                      style={{ width: "12px", height: "12px" }}
                    ></div>
                  </div>
                  <pre
                    className="text-secondary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <code>
                      <span className="text-primary">function</span>{" "}
                      <span className="text-dark">analyzeBug</span>(studentCode){" "}
                      {"{"} <br />
                      &nbsp;&nbsp;
                      <span className="text-success">
                        // CodeBuddy intercepts the error
                      </span>
                      <br />
                      &nbsp;&nbsp;const issue = AI.detectLogicFlaw(studentCode);
                      <br />
                      <br />
                      &nbsp;&nbsp;
                      <span className="text-success">
                        // Generates a hint, not a solution
                      </span>
                      <br />
                      &nbsp;&nbsp;<span className="text-primary">
                        return
                      </span>{" "}
                      generateHint(issue);
                      <br />
                      {"}"}
                    </code>
                  </pre>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* SECTION 2: Structured Features Grid (Updated to 3 Columns) */}
      <Container id="features" className="py-5 mt-4">
        <div className="text-center mb-5">
          <h2 className="fw-bolder" style={{ color: "#1e293b" }}>
            Core Capabilities
          </h2>
          <p className="text-secondary fs-5">
            Built to enforce strong software engineering fundamentals.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm feature-card-pro p-3">
              <Card.Body>
                <div className="icon-wrapper bg-primary-subtle text-primary mb-4">
                  <FaLightbulb className="fs-3" />
                </div>
                <Card.Title className="fw-bold mb-3">Targeted Hints</Card.Title>
                <Card.Text className="text-secondary">
                  Restricts full-code generation. The AI is specifically
                  prompted to act as a guide, providing only logical stepping
                  stones.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm feature-card-pro p-3">
              <Card.Body>
                <div className="icon-wrapper bg-success-subtle text-success mb-4">
                  <FaCode className="fs-3" />
                </div>
                <Card.Title className="fw-bold mb-3">
                  Syntax Agnostic
                </Card.Title>
                <Card.Text className="text-secondary">
                  Capable of analyzing and debugging multiple programming
                  languages including C++, Java, and Python.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm feature-card-pro p-3">
              <Card.Body>
                <div className="icon-wrapper bg-info-subtle text-info mb-4">
                  <FaChartLine className="fs-3" />
                </div>
                <Card.Title className="fw-bold mb-3">
                  Student Analytics
                </Card.Title>
                <Card.Text className="text-secondary">
                  Monitors submission history and tracks the most common logical
                  errors to help identify knowledge gaps.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* SECTION 3: Minimalist Tech Stack */}
      <div className="bg-white border-top py-5 mt-5">
        <Container className="text-center">
          <h5
            className="text-secondary mb-4 fw-bold text-uppercase"
            style={{ letterSpacing: "2px" }}
          >
            System Architecture
          </h5>

          {/* Removed opacity-75 so the CSS can control the hover colors */}
          <div className="d-flex justify-content-center align-items-center gap-5 flex-wrap">
            <div className="tech-hover-item react d-flex flex-column align-items-center">
              <FaReact className="fs-2 mb-2" />{" "}
              <small className="fw-semibold">React</small>
            </div>

            <div className="tech-hover-item node d-flex flex-column align-items-center">
              <FaNodeJs className="fs-2 mb-2" />{" "}
              <small className="fw-semibold">Node.js</small>
            </div>

            <div className="tech-hover-item mongo d-flex flex-column align-items-center">
              <FaDatabase className="fs-2 mb-2" />{" "}
              <small className="fw-semibold">MongoDB</small>
            </div>

            <div className="tech-hover-item gemini d-flex flex-column align-items-center">
              <FaBrain className="fs-2 mb-2" />{" "}
              <small className="fw-semibold">Gemini LLM</small>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 bg-light border-top">
        <p className="mb-1 text-dark fw-semibold">
          © {new Date().getFullYear()} CodeBuddy
        </p>
        <small className="text-secondary">
          Engineered by Tushar Gajbhiye and Team
        </small>
      </footer>
    </div>
  );
}

export default Home;
