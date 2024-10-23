import React, { useEffect } from "react";
import "./Features.css";

function Features() {
  useEffect(() => {
    const featureBlocks = document.querySelectorAll('.feature-block');

    const handleScroll = () => {
      featureBlocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          block.classList.add('visible');
        } else {
          block.classList.remove('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case the blocks are already in view

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <section className="features-section" id="features" aria-labelledby="features-heading">
        <h2 id="features-heading">Advanced Features That Empower Your Finances</h2>
        <div className="feature-blocks" role="list">
          <div className="feature-block" role="listitem">
            <span className="feature-icon" aria-hidden="true" style={{fontSize: '2.5rem'}}>💸</span>
            <h3>Expense Tracking & Categorization</h3>
            <p>Effortlessly log and categorize your expenses to visualize spending patterns and optimize your budget.</p>
          </div>
          <div className="feature-block" role="listitem">
            <span className="feature-icon" aria-hidden="true" style={{fontSize: '2.5rem'}}>📊</span>
            <h3>Budget Creation & Management</h3>
            <p>Create, adjust, and monitor budgets with real-time feedback and smart suggestions for financial discipline.</p>
          </div>
          <div className="feature-block" role="listitem">
            <span className="feature-icon" aria-hidden="true" style={{fontSize: '2.5rem'}}>💰</span>
            <h3>Income & Savings Tracker</h3>
            <p>Track all income sources, monitor savings growth, and set automated reminders for deposits and goals.</p>
          </div>
          <div className="feature-block" role="listitem">
            <span className="feature-icon" aria-hidden="true" style={{fontSize: '2.5rem'}}>📈</span>
            <h3>Financial Insights & Reports</h3>
            <p>Receive comprehensive, interactive reports with actionable insights to improve your financial health.</p>
          </div>
          <div className="feature-block" role="listitem">
            <span className="feature-icon" aria-hidden="true" style={{fontSize: '2.5rem'}}>🎯</span>
            <h3>Goal Setting & Progress Tracking</h3>
            <p>Define savings goals, visualize progress, and celebrate milestones with motivational feedback.</p>
          </div>
        </div>
      </section>
  );
}

export default Features;
