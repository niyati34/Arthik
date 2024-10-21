import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation for nav links
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.target.click();
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : "transparent"}`} aria-label="Main navigation">
      <div className="logo">
        <h1 tabIndex="0" aria-label="Arthik Home">Arthik</h1>
      </div>
      <ul className="nav-links">
        <li><a href="#home" tabIndex="0" aria-label="Home" onKeyDown={handleKeyDown}>Home</a></li>
        <li><a href="#features" tabIndex="0" aria-label="Features" onKeyDown={handleKeyDown}>Features</a></li>
        <li><a href="#testimonials" tabIndex="0" aria-label="Testimonials" onKeyDown={handleKeyDown}>Testimonials</a></li>
        <li><a href="#pricing" tabIndex="0" aria-label="Pricing" onKeyDown={handleKeyDown}>Pricing</a></li>
        <li><a href="#contact" tabIndex="0" aria-label="Contact" onKeyDown={handleKeyDown}>Contact</a></li>
        <li>
          <Link to="/sign-in" className="signup-link" tabIndex="0" aria-label="Sign In or Sign Up" onKeyDown={handleKeyDown}>Sign In/Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
