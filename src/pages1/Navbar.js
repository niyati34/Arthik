import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-container">
        <div className="logo">Arthik</div>
        
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" onClick={closeMenu}>Home</a>
          </li>
          <li>
            <a href="#features" onClick={closeMenu}>Features</a>
          </li>
          <li>
            <a href="#testimonials" onClick={closeMenu}>Reviews</a>
          </li>
          <li>
            <a href="#pricing" onClick={closeMenu}>Pricing</a>
          </li>
          <li>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
          <Link to="/signup" className="cta-button" onClick={closeMenu}>
            Start Free Trial
          </Link>
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 