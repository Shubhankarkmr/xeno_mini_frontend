import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { label: "Dashboard", path: "/" },
    { label: "Campaigns", path: "/campaign" },
    { label: "Customers", path: "/customers" }, // future route
    { label: "Orders", path: "/orders" }, // future route
  ];

  return (
    <aside style={styles.sidebar}>
      <ul style={styles.navList}>
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? "#0056b3" : "transparent",
              })}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "200px",
    minHeight: "100vh",
    backgroundColor: "#007bff",
    color: "#fff",
    paddingTop: "20px",
    position: "sticky",
    top: 0,
  },
  navList: { listStyle: "none", padding: 0 },
  navLink: {
    display: "block",
    padding: "10px 20px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    marginBottom: "5px",
  },
};

export default Sidebar;
