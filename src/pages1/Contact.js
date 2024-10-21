import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-label="Contact section">
      <h2 tabIndex="0">Get in Touch</h2>
      <form className="contact-form" aria-label="Contact form">
        <label htmlFor="name" className="visually-hidden">Name</label>
        <input id="name" name="name" type="text" placeholder="Name" aria-label="Name" required />
        <label htmlFor="email" className="visually-hidden">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" aria-label="Email" required />
        <label htmlFor="message" className="visually-hidden">Message</label>
        <textarea id="message" name="message" placeholder="Message" aria-label="Message" required></textarea>
        <button type="submit" className="submit-button" aria-label="Submit contact form">Submit</button>
      </form>
    </section>
  );
}

export default Contact;