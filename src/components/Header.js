// src/components/Header.js
import React from "react";
import "./styles/Header.css";

const Header = () => {
  return (
    <header className="Header">
      <div className="HeaderInner">
        <div className="HeaderTitleWrap">
          <h1 className="HeaderTitle">Investigaciones</h1>
          <p className="HeaderSubtitle">Síntesis y artículos, en un solo lugar</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
