import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import xenoLogo from "../assets/xeno-logo.jpeg";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("https://backend-hvgn.onrender.com/api/auth", {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
        else setUser(null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://backend-hvgn.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* 🔹 Top Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <img src={xenoLogo} alt="Xeno Logo" className="nav-logo" />
          <h2 className="nav-title">Xeno CRM</h2>
        </div>

        <div className="nav-right">
          {user && (
            <>
              <span className="nav-username">{user.name}</span>
              <img
                className="nav-avatar"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=60A5FA&color=fff&size=64`}
                alt="User Avatar"
              />
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 🔹 Main Content */}
      <main className="dashboard-main">
        <h1 className="dashboard-heading">
          Welcome back, {user?.name} 👋
        </h1>
        {user?.email && (
          <p className="dashboard-email">Signed in as <strong>{user.email}</strong></p>
        )}

        <p className="dashboard-subtext">
          Your central hub for <span className="highlight">customers</span>,{" "}
          <span className="highlight">campaigns</span>, and{" "}
          <span className="highlight">communications</span>.  
          Everything you need to grow smarter and faster — all in one place.
        </p>

        <div className="feature-grid">
          <Link to="/customers" className="feature-card">
            👥 <strong>Manage Customers</strong>
            <p className="card-text">
              View, organize, and nurture your customers with powerful insights.
            </p>
          </Link>

          <Link to="/campaigns" className="feature-card">
            📢 <strong>Create Campaigns</strong>
            <p className="card-text">
              Launch targeted campaigns and engage the right audience at scale.
            </p>
          </Link>

          <Link to="/campaign-history" className="feature-card">
            📊 <strong>Track History</strong>
            <p className="card-text">
              Measure campaign impact and optimize your outreach strategies.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}


