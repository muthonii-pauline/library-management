// client/src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container" style={styles.container}>
      <h1 style={styles.title}>📚 Library Management System</h1>
      <p style={styles.text}>
        Welcome! Manage books, users, and borrowing history with ease.
      </p>

      <nav style={styles.nav}>
        <Link to="/books" style={styles.link}>
          View All Books
        </Link>
        <Link to="/users" style={styles.link}>
          Manage Users
        </Link>
        <Link to="/borrows" style={styles.link}>
          Borrow History
        </Link>
      </nav>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
  },
  link: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0077cc",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default Home;
