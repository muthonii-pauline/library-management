import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Oops! The Page Does Not Exist.</h2>
      <p>Sorry, we couldn’t find what you were looking for.</p>
      <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back home
      </Link>
    </div>
  );
};

export default Error;
