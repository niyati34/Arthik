import React from "react";
import "./Pricing.css";

function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <h2>Choose Your Plan</h2>
      <div className="pricing-plans">
        <div className="plan">
          <h3>Basic Plan</h3>
          <p>$99 - Includes expense monitoring, tracking, and analysis.</p>
        </div>
        <div className="plan">
          <h3>Advanced Plan</h3>
          <p>$149 - Includes balance monitoring, smart notifications, and multi-sport tracking.</p>
        </div>
        <div className="plan">
          <h3>Pro Plan</h3>
          <p>$199 - Includes all features plus personalized health insights and 1-year warranty.</p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
