import React from "react";
import "./Signin"; // Import your new CSS file

const SignIn = () => {
  return (
    <div
      className="signin-signup-container"
      role="main"
      aria-label="Sign In / Sign Up"
    >
      <div className="video-container">
        <video className="video-background" autoPlay loop muted>
          <source src={require("../assets1/videobg3.mp4")} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="form-container">
        <h1 tabIndex="0">Sign In / Sign Up</h1>
        <form aria-label="Sign In or Sign Up form">
          <label htmlFor="username" className="visually-hidden">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            aria-label="Username"
            required
          />
          <label htmlFor="password" className="visually-hidden">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            aria-label="Password"
            required
          />
          <button type="submit" aria-label="Submit sign in or sign up form">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
