import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("codebuddy-theme");
    if (savedTheme) setTheme(savedTheme);
    else setTheme("light");
  }, []);

  useEffect(() => {
    localStorage.setItem("codebuddy-theme", theme);
    document.body.style.backgroundColor =
      theme === "dark" ? "#121212" : "#ffffff";
    document.body.style.color = theme === "dark" ? "#f1f1f1" : "#212529";
    document.body.classList.toggle("dark-mode", theme === "dark"); // 👈 add this line
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
