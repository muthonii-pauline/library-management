import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Library Management System</p>
    </footer>
  );
};

export default Footer;
