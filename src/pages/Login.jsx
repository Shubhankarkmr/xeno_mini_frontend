import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import xenoLogo from "../assets/xeno-logo.jpeg";
import google from '../assets/google.jpg'
export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error checking login status:", err);
      }
    };
    checkAuth();
  }, [navigate]);

  const startGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side illustration */}
        <div className="login-image">
          <img src={xenoLogo} alt="Xeno CRM Illustration" />
        </div>

        {/* Right side login card */}
        <div className="login-card">
          <h1 className="login-title">Welcome to Xeno CRM 🚀</h1>
          <p className="login-subtitle">
            Manage campaigns, customers & insights in one place.  
            Sign in to continue.
          </p>

          <button onClick={startGoogle} className="google-btn">
            <img src={google} alt="Google Icon" className="google-icon" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

