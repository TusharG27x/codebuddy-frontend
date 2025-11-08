// src/apiConfig.js

// This line reads the VITE_API_URL we set on Vercel.
// If it can't find it (on your local machine), it defaults to localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_URL;
