import React from 'react';
import './Signin'; // Import your new CSS file

const SignIn = () => {
  return (
    <div className="signin-signup-container">
      <div className="video-container">
        <video className="video-background" autoPlay loop muted>
          <source src={require('../assets1/videobg3.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="form-container">
        <h1>Sign In / Sign Up</h1>
        <form>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
