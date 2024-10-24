import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    text: "ExpenseFlow has completely changed the way I manage my finances. The intuitive interface and powerful features make budgeting a breeze!",
    author: "Priya Sharma",
    role: "Product Designer",
  },
  {
    text: "I love how ExpenseFlow helps me track my spending and set realistic goals. The charts and insights are super helpful!",
    author: "Rahul Verma",
    role: "Software Engineer",
  },
  {
    text: "The best expense tracker I've used! Clean design, easy to use, and the minimalist approach is just perfect.",
    author: "Aarti Patel",
    role: "Freelancer",
  },
];

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Users Say</h2>
          <p className="testimonials-subtitle">
            Join thousands of satisfied users who've transformed their financial lives
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="testimonial-text">{testimonial.text}</div>
              <div className="testimonial-author">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
