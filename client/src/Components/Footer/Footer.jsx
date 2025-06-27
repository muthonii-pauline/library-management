import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="f-wrapper">
      <div className="f-container">
        <div className="f-left">
          <NavLink to="/">
            <img
              src="/library logo.jpg"
              alt="LibraryManagement"
              width={100}
              className="footer-logo"
            />
          </NavLink>
        </div>

        <div className="quick-links-section">
          <p className="primaryText mb-2">Quick Links</p>
          <nav className="f-menu vertical-menu">
            <NavLink to="/" end>
                      Home
            </NavLink>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/borrows">Borrows</NavLink>
            <NavLink to="/Users">Users</NavLink>
          </nav>
        </div>

      </div>

      <div className="f-bottom text-center w-100 mt-3">
        <small className="text-muted">
          &copy; {new Date().getFullYear()} All Rights Deserved
        </small>
      </div>
    </footer>
  );
};

export default Footer;
