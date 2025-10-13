// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, ProgressBar, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../App.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentUser"));
    setUser(data);
  }, []);

  const progress = 65; // Dummy progress value

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Problems Solved",
        data: [2, 4, 3, 6, 5, 7],
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
      <h2 className="fw-bold text-primary mb-4 text-center">
        Welcome back, {user ? user.email.split("@")[0] : "Learner"} 👋
      </h2>

      <Row className="g-4 mb-4">
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
        <Col md={6}>
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold mb-2">
                Next Suggested Topic
              </Card.Title>
              <p className="text-muted mb-3">
                Dynamic Programming — master efficient problem-solving 💡
              </p>
              <Button variant="primary" href="/editor" className="w-100">
                Start Practice
              </Button>
            </Card.Body>
          </Card>
        </Col>

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
