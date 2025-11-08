// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth

function ProtectedRoute({ children }) {
  const { userInfo } = useAuth(); // 2. Get userInfo from our context

  // 3. Check for userInfo instead of 'currentUser'
  if (!userInfo) {
    // We can remove the alert. A simple redirect is cleaner.
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
