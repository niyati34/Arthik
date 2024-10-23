import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components1/Navbar';
import Home from './pages1/Home';
import Features from './pages1/Features';
import Testimonials from './pages1/Testimonials';
import Pricing from './pages1/Pricing';
import Contact from './pages1/Contact';
import SignInSignUp from './pages1/SigninSignup';
import './App1.css';

function App1() {
  return (
    <div className="App" role="main" aria-label="Main content">
      <a href="#main-content" className="visually-hidden" tabIndex="0">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        {/* Modern, minimal hero section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Arthik: Your Advanced Expense Tracker</h1>
            <p>Track, analyze, and optimize your finances with a beautiful, secure, and easy-to-use platform.</p>
            <a href="/sign-in" className="hero-button">Get Started</a>
          </div>
        </section>
        {/* Feature highlights */}
        <Features />
        {/* Social proof/testimonials */}
        <Testimonials />
        {/* Pricing plans */}
        <Pricing />
        {/* Contact section */}
        <Contact />
      </main>
    </div>
  );
}

export default App1;
