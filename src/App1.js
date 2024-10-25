import React from "react";
import Navbar from "./components1/Navbar";
import Home from "./pages1/Home";
import Features from "./pages1/Features";
import Testimonials from "./pages1/Testimonials";
import Pricing from "./pages1/Pricing";
import Contact from "./pages1/Contact";
import "./App1.css";

function App1() {
  return (
    <div className="App" role="main" aria-label="Main content">
      <Navbar />
      <Home />
      <Features />
      <Testimonials />
      <Pricing />
      <Contact />
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <h3>Arthik</h3>
              <p>
                Empowering individuals to take control of their financial future 
                with clarity and confidence.
              </p>
            </div>
            <div className="footer__nav">
              <div className="footer__nav-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
              </div>
              <div className="footer__nav-group">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer__nav-group">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; 2024 Arthik. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App1;
