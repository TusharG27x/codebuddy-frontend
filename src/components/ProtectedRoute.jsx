// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("⚠️ Please login to access this page!");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
