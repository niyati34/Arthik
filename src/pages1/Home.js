import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <section className="home-hero">
      <div className="container">
        <div className="hero__eyebrow">Financial Management Platform</div>
        <h1 className="hero__title">Manage money with clarity.</h1>
        <p className="hero__subtitle">
          Take control of your finances with our intuitive tools. Track expenses, 
          set budgets, and achieve your financial goals with confidence.
        </p>
        <div className="hero__actions">
          <a href="#features" className="button button--primary">
            Get Started
          </a>
          <a href="#pricing" className="button button--ghost">
            View Pricing
          </a>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <div className="stat__number">50K+</div>
            <div className="stat__label">Active Users</div>
          </div>
          <div className="stat">
            <div className="stat__number">$2.5M</div>
            <div className="stat__label">Saved</div>
          </div>
          <div className="stat">
            <div className="stat__number">98%</div>
            <div className="stat__label">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
