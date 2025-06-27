import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <>
      <div className="app-container">
        <Header />
        <main style={{flex: 1}}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
