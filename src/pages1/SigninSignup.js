import React, { useState } from "react";
import "./SigninSignup.css";

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isSignUp) {
        console.log("Sign up successful:", formData);
        // Handle sign up logic
      } else {
        console.log("Sign in successful:", formData);
        // Handle sign in logic
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setGeneralError("");
  };

  return (
    <div className="auth-signin-signup-container">
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p>
            {isSignUp
              ? "Sign up to start managing your finances"
              : "Sign in to continue to your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {generalError && (
            <div className="auth-general-error">{generalError}</div>
          )}

          <div className="auth-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="auth-error-message">{errors.email}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="auth-error-message">{errors.password}</span>
            )}
          </div>

          {isSignUp && (
            <div className="auth-form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="auth-error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-loading-spinner">Processing...</span>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="auth-toggle-mode-button"
              onClick={toggleMode}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInSignUp;
