import React from "react";
import "./Pricing.css";

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2>Simple, Transparent Pricing</h2>
          <p className="pricing-subtitle">
            Choose the plan that fits your financial goals
          </p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-name">Basic</h3>
            <div className="plan-price">
              $0<span>/month</span>
            </div>
            <ul className="plan-features">
              <li>Track up to 100 transactions</li>
              <li>Basic expense categories</li>
              <li>Monthly spending reports</li>
              <li>Mobile app access</li>
              <li>Email support</li>
            </ul>
            <a href="#" className="pricing-cta">
              Get Started
            </a>
          </div>
          <div className="pricing-card featured">
            <h3 className="plan-name">Pro</h3>
            <div className="plan-price">
              $9<span>/month</span>
            </div>
            <ul className="plan-features">
              <li>Unlimited transactions</li>
              <li>Advanced analytics & insights</li>
              <li>Custom categories & tags</li>
              <li>Budget planning tools</li>
              <li>Goal tracking</li>
              <li>Priority support</li>
            </ul>
            <a href="#" className="pricing-cta">
              Start Free Trial
            </a>
          </div>
          <div className="pricing-card">
            <h3 className="plan-name">Business</h3>
            <div className="plan-price">
              $29<span>/month</span>
            </div>
            <ul className="plan-features">
              <li>Everything in Pro</li>
              <li>Multi-user access</li>
              <li>Business expense reports</li>
              <li>API integration</li>
              <li>Advanced security</li>
              <li>Dedicated support</li>
            </ul>
            <a href="#" className="pricing-cta">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
