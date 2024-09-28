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
    <section className="features-section" id="features">
      <h2>Features That Keep You Ahead</h2>
      <div className="feature-blocks">
        <div className="feature-block">
          <h3>Expense Tracking and Categorization</h3>
          <p>Effortlessly log and categorize your expenses to see where your money goes.</p>
        </div>
        <div className="feature-block">
          <h3>Budget Creation and Management</h3>
          <p>Analyze your sleep patterns and get insights into deep sleep, REM sleep, and awake time.</p>
        </div>
        <div className="feature-block">
          <h3>Income and Savings Tracker</h3>
          <p>Monitor all income sources and track savings progress in real-time.</p>
        </div>
        <div className="feature-block">
          <h3>Financial Insights and Reports</h3>
          <p>Receive comprehensive reports that analyze your spending habits.</p>
        </div>
        <div className="feature-block">
          <h3>Goal Setting and Progress Tracking</h3>
          <p>Define savings goals and track your progress towards achieving them.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
