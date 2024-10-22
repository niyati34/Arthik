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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignInSignUp />} />
        </Routes>
        <Features />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
    </div>
  );
}

export default App1;
