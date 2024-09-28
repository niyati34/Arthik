import React from 'react';
import './SigninSignup.css';
import { useNavigate } from 'react-router-dom';

const SignInSignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // You can add your sign-in logic here (e.g., authentication)

        // If sign-in is successful, navigate to the home page
        navigate('/home');
    };

    return (
        <div className="signin-signup-container">
            <div className="form-container">
                <h1>Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignInSignUp;
