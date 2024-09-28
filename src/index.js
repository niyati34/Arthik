import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App1 from './App1'; // Your landing page component
import App from './App'; // Your home page component
import { GlobalProvider } from './context/globalContext'; // Adjust path as necessary
import SignInSignUp from './pages1/SigninSignup';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GlobalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App1 />} />
        <Route path="/sign-in" element={<SignInSignUp />} /> {/* Add this line */}

        <Route path="/home" element={<App />} />
      </Routes>
    </Router>
  </GlobalProvider>
);
