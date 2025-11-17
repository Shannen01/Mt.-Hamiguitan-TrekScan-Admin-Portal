import React, { useState, useEffect } from 'react';
import { signIn, getCurrentUser, onAuthStateChange } from '../../services/firebaseAuthService';
import '../style/Login.css';
import logoImage from '../../assets/Logo_admin_portal.png';
import trekScanText from '../../assets/TrekScan_welomelogo.png';

// Login page component
function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Disable body scroll while Login is mounted
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    email: '', // Changed from username to email for Firebase Auth
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Check if user is already authenticated on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    // Check current user immediately
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }

    return () => unsubscribe();
  }, [onLoginSuccess]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Sign in with Firebase Auth
      await signIn(formData.email, formData.password);
      // Auth state change listener will handle the redirect
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={trekScanText} alt="TrekScan+ Text" className="trek-scan-text" />
      </div>
      <div className="login-card">
        <div className="login-header">
          <img src={logoImage} alt="TrekScan+ Admin Portal" className="login-logo" />
          <h2 className="welcome-text">Welcome back, Admin!</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {formErrors.email && (
              <span className="field-error">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={formErrors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {formErrors.password && (
              <span className="field-error">{formErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
