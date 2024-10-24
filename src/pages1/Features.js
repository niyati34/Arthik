import React, { useEffect } from "react";
import "./Features.css";

function Features() {
  useEffect(() => {
    const featureBlocks = document.querySelectorAll(".feature-block");

    const handleScroll = () => {
      featureBlocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          block.classList.add("visible");
        } else {
          block.classList.remove("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check in case the blocks are already in view

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="fade-in">
          <h2>Powerful Features for Smart Money Management</h2>
          <p className="features-subtitle">
            Everything you need to track, analyze, and optimize your spending in
            one intuitive platform
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card fade-in">
            <div className="feature-icon">�</div>
            <h3>Expense Tracking</h3>
            <p>
              Automatically categorize and track all your expenses with smart
              recognition and customizable categories.
            </p>
          </div>
          <div className="feature-card fade-in">
            <div className="feature-icon">�</div>
            <h3>Budget Management</h3>
            <p>
              Set realistic budgets, monitor spending limits, and get alerts
              when you're approaching your limits.
            </p>
          </div>
          <div className="feature-card fade-in">
            <div className="feature-icon">📈</div>
            <h3>Financial Insights</h3>
            <p>
              Get detailed reports and analytics to understand your spending
              patterns and identify saving opportunities.
            </p>
          </div>
          <div className="feature-card fade-in">
            <div className="feature-icon">🎯</div>
            <h3>Goal Setting</h3>
            <p>
              Set and track financial goals with visual progress indicators and
              milestone celebrations.
            </p>
          </div>
          <div className="feature-card fade-in">
            <div className="feature-icon">�</div>
            <h3>Bank-Level Security</h3>
            <p>
              Your financial data is protected with enterprise-grade encryption
              and security protocols.
            </p>
          </div>
          <div className="feature-card fade-in">
            <div className="feature-icon">📱</div>
            <h3>Multi-Device Sync</h3>
            <p>
              Access your data anywhere with seamless synchronization across all
              your devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
