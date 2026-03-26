// src/pages/Dashboard.jsx
import API_URL from "../apiConfig";
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  ProgressBar,
  Button,
  Spinner,
  Container,
} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../App.css";

// --- 1. Imports for API and State ---
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function Dashboard() {
  const { userInfo } = useAuth(); // 2. Get user info from context
  const [stats, setStats] = useState(null); // 3. State for our fetched data
  const [loading, setLoading] = useState(true); // 4. Loading state

  // --- 5. Fetch Data on Page Load ---
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/dashboard/stats`,
          { withCredentials: true }, // Sends our auth cookie
        );
        setStats(data);
        setLoading(false);
      } catch (error) {
        toast.error("Could not load dashboard data.");
        console.error("Fetch stats error:", error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); // Runs once on mount

  // --- 6. Show a loading spinner ---
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="ms-3 mb-0 fw-semibold text-secondary">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // --- NEW SAFETY CHECK: Stop the crash if data failed to load ---
  if (!stats) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <h4 className="text-danger fw-bold mb-3">
          Oops! Could not load your stats.
        </h4>
        <p className="text-secondary">
          Please make sure your backend server is running.
        </p>
        <Button
          variant="outline-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // --- 7. Prepare Chart Data (now that we have stats) ---
  const progress = 65; // Dummy progress value (as before)

  const chartData = {
    labels: stats.weeklyProgress.map((d) => d.day), // Use dynamic labels
    datasets: [
      {
        label: "Problems Solved",
        data: stats.weeklyProgress.map((d) => d.problems), // Use dynamic data
        fill: true,
        backgroundColor: "rgba(13,110,253,0.1)",
        borderColor: "#0d6efd",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#0d6efd",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div
      className="dashboard-page bg-light"
      style={{ minHeight: "100vh", paddingBottom: "4rem" }}
    >
      <Container className="pt-5">
        {/* --- 8. Use user's real name with updated Enterprise Typography --- */}
        <div className="mb-5 text-center text-md-start">
          <h2 className="fw-bolder mb-1" style={{ color: "#1e293b" }}>
            Welcome back, {userInfo ? userInfo.name : "Learner"} 👋
          </h2>
          <p className="text-secondary fs-5">
            Here is an overview of your coding journey.
          </p>
        </div>

        <Row className="g-4 mb-4">
          {/* (This card is still using dummy data, as before) */}
          <Col lg={4}>
            <Card className="dashboard-card shadow-sm border-0 text-center h-100 p-2">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title
                  className="fw-bold mb-3"
                  style={{ color: "#1e293b" }}
                >
                  Today’s Progress
                </Card.Title>
                <ProgressBar
                  now={progress}
                  label={`${progress}%`}
                  className="my-3 rounded-pill"
                  variant="primary"
                  style={{
                    height: "24px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                />
                <p className="text-muted small mb-0 fw-semibold">
                  Keep coding — you’re doing great! 🚀
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* --- 9. This card is now DYNAMIC --- */}
          <Col lg={8}>
            <Card className="dashboard-card shadow-sm border-0 h-100 p-2">
              <Card.Body>
                <Card.Title
                  className="fw-bold mb-4"
                  style={{ color: "#1e293b" }}
                >
                  Weekly Activity
                </Card.Title>
                <div style={{ height: "280px" }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* --- 10. This card is now DYNAMIC --- */}
          <Col md={6}>
            <Card className="dashboard-card shadow-sm border-0 h-100 p-2">
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className="fw-bold mb-3"
                  style={{ color: "#1e293b" }}
                >
                  Next Suggested Topic
                </Card.Title>
                <div className="bg-primary-subtle rounded p-3 mb-4 flex-grow-1">
                  <p className="text-primary fw-semibold mb-0">
                    <span className="text-dark">Topic:</span> {stats.nextTopic}{" "}
                    💡
                  </p>
                  <small className="text-secondary">
                    Master efficient problem-solving.
                  </small>
                </div>
                <Button
                  variant="primary"
                  href="/editor"
                  className="w-100 py-2 fw-semibold"
                >
                  Start Practice
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* (This card is still using dummy data, as before) */}
          <Col md={6}>
            <Card className="dashboard-card shadow-sm border-0 h-100 p-2">
              <Card.Body>
                <Card.Title
                  className="fw-bold mb-4"
                  style={{ color: "#1e293b" }}
                >
                  Leaderboard
                </Card.Title>
                <ul className="list-unstyled leaderboard-list mb-0">
                  <li className="d-flex justify-content-between align-items-center px-3 py-2">
                    <span className="fw-semibold">🥇 Alice</span>
                    <span className="badge bg-primary rounded-pill">
                      320 pts
                    </span>
                  </li>
                  <li className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
                    <span className="fw-semibold">🥈 Tushar</span>
                    <span className="badge bg-secondary rounded-pill">
                      280 pts
                    </span>
                  </li>
                  <li className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
                    <span className="fw-semibold">🥉 Raj</span>
                    <span className="badge bg-dark rounded-pill">250 pts</span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
