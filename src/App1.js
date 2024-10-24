import React, { useEffect } from "react";
import Navbar from "./components1/Navbar";
import Features from "./pages1/Features";
import Testimonials from "./pages1/Testimonials";
import Pricing from "./pages1/Pricing";
import Contact from "./pages1/Contact";
import "./App1.css";

function App1() {
  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Dashboard animation
    const dashboardItems = document.querySelectorAll('.expense-item');
    let animationIndex = 0;

    function animateDashboard() {
      dashboardItems.forEach((item, index) => {
        if (item) {
          item.style.opacity = index === animationIndex ? '1' : '0.6';
        }
      });
      animationIndex = (animationIndex + 1) % dashboardItems.length;
    }

    const dashboardInterval = setInterval(animateDashboard, 2000);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(dashboardInterval);
    };
  }, []);

  return (
    <div className="App" role="main" aria-label="Main content">
      <Navbar />
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-container">
          <div className="hero-content fade-in">
            <h1>Take Control of Your Finances</h1>
            <p>
              Track expenses, manage budgets, and achieve your financial goals
              with our intelligent expense tracking platform.
            </p>
            <div className="hero-buttons">
              <a href="/sign-in" className="cta-button">
                Get Started Free
              </a>
              <button className="secondary-button" onClick={() => alert('Demo coming soon!')}>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <h3
                  style={{ color: "var(--text-primary)", fontSize: "1.1rem" }}
                >
                  Dashboard
                </h3>
              </div>
              <div className="balance-card">
                <h4 style={{ marginBottom: "0.5rem", opacity: 0.9 }}>
                  Current Balance
                </h4>
                <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                  $4,250.80
                </div>
              </div>
              <div className="expense-list">
                <div className="expense-item" style={{ opacity: 1 }}>
                  <span>🍕 Food & Dining</span>
                  <span style={{ color: "var(--danger)" }}>-$45.20</span>
                </div>
                <div className="expense-item" style={{ opacity: 0.6 }}>
                  <span>⛽ Transportation</span>
                  <span style={{ color: "var(--danger)" }}>-$28.50</span>
                </div>
                <div className="expense-item" style={{ opacity: 0.6 }}>
                  <span>� Utilities</span>
                  <span style={{ color: "var(--danger)" }}>-$125.00</span>
                </div>
                <div className="expense-item" style={{ opacity: 0.6 }}>
                  <span>💼 Income</span>
                  <span style={{ color: "var(--success)" }}>+$3,200.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />
      {/* Testimonials Section */}
      <Testimonials />
      {/* Pricing Section */}
      <Pricing />
      {/* Contact Section */}
      <Contact />
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>ExpenseFlow</h3>
            <p>Take control of your finances with intelligent expense tracking.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App1;
