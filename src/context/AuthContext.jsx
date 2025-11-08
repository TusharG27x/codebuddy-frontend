// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider (a component that will wrap our app)
export const AuthProvider = ({ children }) => {
  // 3. Get user info from localStorage as the initial state
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  // 4. A function to update the state and localStorage on login
  const login = (userData) => {
    setUserInfo(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  // 5. A function to clear state and localStorage on logout
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    // We'll also call the backend logout endpoint later
  };

  // 6. The value to be shared with all child components
  const value = {
    userInfo,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 7. A custom hook to easily access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
