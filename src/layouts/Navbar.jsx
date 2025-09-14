import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Xeno Mini CRM</div>
      {user && (
        <div style={styles.userSection}>
          <span>Welcome, {user.name}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  brand: { fontWeight: "bold", fontSize: "1.2rem" },
  userSection: { display: "flex", alignItems: "center", gap: "15px" },
  logoutBtn: {
    padding: "5px 12px",
    backgroundColor: "#fff",
    color: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
