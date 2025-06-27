import React from "react";
import { NavLink } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <section className="h-wrapper">
      <div className="h-container">
        <NavLink to="/">
          <img
            src="/librarylogo.jpg"
            alt="Library Management"
            width={100}
            className="logo"
          />
        </NavLink>
      </div>

      <div className="h-menu">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/borrows">Pets</NavLink>
        <NavLink to="/Users">Staff</NavLink>
      </div>
    </section>
  );
};

export default Header;
