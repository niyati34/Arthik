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
          <div className="testimonial-box" role="listitem">
            <img src={require("../img/avatar.png")} alt="Sarah T. avatar" className="testimonial-avatar" />
            <blockquote>
              <span className="testimonial-quote">“Arthik helped me finally stick to my budget. The insights are a game changer!”</span>
              <span className="testimonial-author">Sarah T., Designer</span>
            </blockquote>
          </div>
          <div className="testimonial-box" role="listitem">
            <img src={require("../img/bg.png")} alt="Mike L. avatar" className="testimonial-avatar" />
            <blockquote>
              <span className="testimonial-quote">“I saved $200 last month thanks to the smart recommendations and reminders!”</span>
              <span className="testimonial-author">Mike L., Developer</span>
            </blockquote>
          </div>
          <div className="testimonial-box" role="listitem">
            <img src={require("../img/avatar.png")} alt="David W. avatar" className="testimonial-avatar" />
            <blockquote>
              <span className="testimonial-quote">“The goal tracking keeps me motivated. I love celebrating milestones!”</span>
              <span className="testimonial-author">David W., Student</span>
            </blockquote>
          </div>
          <div className="testimonial-box" role="listitem">
            <img src={require("../img/bg.png")} alt="Priya S. avatar" className="testimonial-avatar" />
            <blockquote>
              <span className="testimonial-quote">“Beautiful UI, easy to use, and the reports are super helpful for my family.”</span>
              <span className="testimonial-author">Priya S., Parent</span>
            </blockquote>
          </div>
          <div className="testimonial-box" role="listitem">
            <img src={require("../img/avatar.png")} alt="Alex R. avatar" className="testimonial-avatar" />
            <blockquote>
              <span className="testimonial-quote">“I recommend Arthik to all my friends. It’s the best finance app I’ve tried!”</span>
              <span className="testimonial-author">Alex R., Entrepreneur</span>
            </blockquote>
          </div>
      </div>
    </section>
  );
}

export default Testimonials;
