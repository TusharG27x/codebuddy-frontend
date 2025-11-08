// src/pages/Dashboard.jsx
import API_URL from "../apiConfig";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, ProgressBar, Button, Spinner } from "react-bootstrap";
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
          { withCredentials: true } // Sends our auth cookie
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
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Loading your dashboard...</p>
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
    <div className="container py-5 dashboard-page">
      {/* --- 8. Use user's real name --- */}
      <h2 className="fw-bold text-primary mb-4 text-center">
        Welcome back, {userInfo ? userInfo.name : "Learner"} 👋
      </h2>

      <Row className="g-4 mb-4">
        {/* (This card is still using dummy data, as before) */}
        <Col md={4}>
          <Card className="dashboard-card shadow-sm border-0 text-center">
            <Card.Body>
              <Card.Title className="fw-semibold mb-3">
                Today’s Progress
              </Card.Title>
              <ProgressBar
                now={progress}
                label={`${progress}%`}
                className="my-3"
                variant="primary"
                style={{ height: "20px" }}
              />
              <p className="text-muted small mb-0">
                Keep coding — you’re doing great! 🚀
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* --- 9. This card is now DYNAMIC --- */}
        <Col md={8}>
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold mb-3 text-center">
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
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold mb-2">
                Next Suggested Topic
              </Card.Title>
              <p className="text-muted mb-3">
                {stats.nextTopic} — master efficient problem-solving 💡
              </p>
              <Button variant="primary" href="/editor" className="w-100">
                Start Practice
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* (This card is still using dummy data, as before) */}
        <Col md={6}>
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold mb-3">Leaderboard</Card.Title>
              <ul className="list-unstyled leaderboard-list">
                <li>🥇 Alice — 320 pts</li>
                <li>🥈 Tushar — 280 pts</li>
                <li>🥉 Raj — 250 pts</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
