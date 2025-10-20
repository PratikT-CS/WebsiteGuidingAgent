import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          Sample Website
        </Link>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                ...(isActive("/") ? styles.activeLink : {}),
              }}
            >
              Home
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link
              to="/about"
              style={{
                ...styles.navLink,
                ...(isActive("/about") ? styles.activeLink : {}),
              }}
            >
              About
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link
              to="/services"
              style={{
                ...styles.navLink,
                ...(isActive("/services") ? styles.activeLink : {}),
              }}
            >
              Services
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link
              to="/blog"
              style={{
                ...styles.navLink,
                ...(isActive("/blog") ? styles.activeLink : {}),
              }}
            >
              Blog
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link
              to="/contact"
              style={{
                ...styles.navLink,
                ...(isActive("/contact") ? styles.activeLink : {}),
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#2c3e50",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#ffffff",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "2rem",
  },
  navItem: {
    margin: 0,
  },
  navLink: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    transition: "all 0.3s ease",
  },
  activeLink: {
    backgroundColor: "#3498db",
    color: "#ffffff",
  },
};

export default Navigation;
