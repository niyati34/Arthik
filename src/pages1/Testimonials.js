import React from "react";
import "./Testimonials.css";
const testimonials = [
  {
    rating: 5,
    text: "ExpenseFlow has completely changed the way I manage my finances. The intuitive interface and powerful features make budgeting a breeze!",
    author: "Priya Sharma",
    avatar: require("../img/avatar.png"),
    role: "Product Designer",
  },
  {
    rating: 5,
    text: "I love how ExpenseFlow helps me track my spending and set realistic goals. The charts and insights are super helpful!",
    author: "Rahul Verma",
    avatar: require("../img/avatar.png"),
    role: "Software Engineer",
  },
  {
    rating: 5,
    text: "The best expense tracker I've used! Clean design, easy to use, and the neon theme is just awesome.",
    author: "Aarti Patel",
    avatar: require("../img/avatar.png"),
    role: "Freelancer",
  },
];

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} aria-label="star" role="img">
                    ★
                  </span>
                ))}
              </div>
              <div className="testimonial-text">{testimonial.text}</div>
              <div className="testimonial-author">
                <span className="author-avatar">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author + " avatar"}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </span>
                <span className="author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
