import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend-hvgn.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Uncomment if your backend uses cookies
  // withCredentials: true,
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Logout user on 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to login
      }
      console.error("API Error:", error.response.data.message || error.message);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
