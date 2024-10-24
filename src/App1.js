import React from "react";
import Navbar from "./components1/Navbar";
import Features from "./pages1/Features";
import Testimonials from "./pages1/Testimonials";
import Pricing from "./pages1/Pricing";
import Contact from "./pages1/Contact";
import "./App1.css";

function App1() {
  return (
    <div className="App" role="main" aria-label="Main content">
      <Navbar />

      <section className="hero" id="hero">
        <div className="container">
          <p className="hero__eyebrow">ExpenseFlow</p>
          <h1 className="hero__title">Manage money with clarity.</h1>
          <p className="hero__subtitle">
            A minimalist expense tracker that helps you see, plan, and grow
            without the noise. Track every penny, set smart budgets, and achieve
            your financial goals with elegant simplicity.
          </p>
          <div className="hero__actions">
            <a href="/sign-in" className="button button--primary">
              Get started free
            </a>
            <a href="#features" className="button button--ghost">
              See how it works
            </a>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <span className="stat__number">50K+</span>
              <span className="stat__label">Active users</span>
            </div>
            <div className="stat">
              <span className="stat__number">$2.1M</span>
              <span className="stat__label">Tracked monthly</span>
            </div>
            <div className="stat">
              <span className="stat__number">4.9★</span>
              <span className="stat__label">User rating</span>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Testimonials />
      <Pricing />
      <Contact />

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <h3>ExpenseFlow</h3>
            <p>Making personal finance simple and beautiful.</p>
          </div>
          
          <nav className="footer__nav">
            <div className="footer__nav-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Security</a>
            </div>
            
            <div className="footer__nav-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            
            <div className="footer__nav-group">
              <h4>Support</h4>
              <a href="#contact">Contact</a>
              <a href="#">Help Center</a>
              <a href="#">Privacy Policy</a>
            </div>
          </nav>
        </div>
        
        <div className="footer__bottom">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App1;
