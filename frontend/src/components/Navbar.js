import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, ProfileIcon } from "./icons";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink
        className={({ isActive }) => `nav-item${isActive ? " is-active" : ""}`}
        to="/"
      >
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) => `nav-item${isActive ? " is-active" : ""}`}
        to="/profile"
      >
        <ProfileIcon />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;