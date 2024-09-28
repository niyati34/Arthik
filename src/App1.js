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
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInSignUp />} />
      </Routes>
      <Features />
      <Testimonials />
      <Pricing />
      <Contact />
    </div>
  );
}

export default App1;
