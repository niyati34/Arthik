import React from "react";
import "./Home.css";
import videoSrc from "../assets1/videobg3.mp4"; // Adjust the path as needed
import piggyImg from "../assets1/piggy1.png"; // Replace with the actual filename of your animated PNG

const Home = () => {
  return (
    <div className="home-container">
      <div className="video-container">
        <video className="video-background" autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="main-content">
        <div className="text-section">
          <h1>Track. Control. Grow.</h1>
          <p>
            Track expenses, set budgets, and gain insights <br />
            to improve your financial health effortlessly.
          </p>
          <button className="hero-button">Get Started</button>
        </div>
        <div className="image-section">
          <img className="right-image" src={piggyImg} alt="Animated Piggy" />
        </div>
      </div>
      <div className="features-section">
        <h2>Why Arthik?</h2>
        <div className="features-list">
          <div className="feature-card">
            <span role="img" aria-label="budget">
              💰
            </span>
            <h3>Budget Tracking</h3>
            <p>Set monthly budgets and track your spending in real time.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="insights">
              📊
            </span>
            <h3>Smart Insights</h3>
            <p>Visualize your financial health with charts and analytics.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="secure">
              🔒
            </span>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and never shared.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
