import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App1 from "./App1"; // Landing page component
import App from "./App"; // Dashboard component
import { GlobalProvider } from "./context/globalContext";
import SignInSignUp from "./pages1/SigninSignup";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App1 />} />
        <Route path="/signin" element={<SignInSignUp />} />
        <Route path="/signup" element={<SignInSignUp />} />
        <Route path="/home" element={<App />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="*" element={<App1 />} />
      </Routes>
    </Router>
  </GlobalProvider>
);
