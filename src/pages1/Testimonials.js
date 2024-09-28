import React, { useEffect, useRef } from "react";
import "./Testimonials.css";

function Testimonials() {
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const testimonialsContainer = testimonialsRef.current;
    let interval;

    const startMovement = () => {
      interval = setInterval(() => {
        testimonialsContainer.scrollBy({ left: 300, behavior: "smooth" });
        if (testimonialsContainer.scrollLeft >= testimonialsContainer.scrollWidth - testimonialsContainer.clientWidth) {
          testimonialsContainer.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 3000);
    };

    const stopMovement = () => {
      clearInterval(interval);
    };

    testimonialsContainer.addEventListener("mouseover", stopMovement);
    testimonialsContainer.addEventListener("mouseout", startMovement);

    startMovement();

    return () => {
      clearInterval(interval);
      testimonialsContainer.removeEventListener("mouseover", stopMovement);
      testimonialsContainer.removeEventListener("mouseout", startMovement);
    };
  }, []);

  return (
    <section className="testimonials-section" id="testimonials">
      <h2>What Our Users Are Saying</h2>
      <div className="testimonials-container" ref={testimonialsRef}>
        <div className="testimonial-box">
          <blockquote>"This app transformed how I manage my money. I feel more in control than ever!" - Sarah T.</blockquote>
        </div>
        <div className="testimonial-box">
          <blockquote>"The personalized recommendations helped me save $200 last month!" - Mike L.</blockquote>
        </div>
        <div className="testimonial-box">
          <blockquote>"I love the Earn points for achieving budgeting milestones." — David W.</blockquote>
        </div>
        <div className="testimonial-box">
          <blockquote>"This app transformed how I manage my money. I feel more in control than ever!" - Sarah T.</blockquote>
        </div>
        <div className="testimonial-box">
          <blockquote>"The personalized recommendations helped me save $200 last month!" - Mike L.</blockquote>
        </div>
        <div className="testimonial-box">
          <blockquote>"I love the Earn points for achieving budgeting milestones." — David W.</blockquote>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
