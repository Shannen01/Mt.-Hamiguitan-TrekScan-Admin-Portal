import React, { useState, useEffect } from 'react';
import { signIn, getCurrentUser, onAuthStateChange } from '../../services/firebaseAuthService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../style/Login.css';
import logoImage from '../../assets/Logo_admin_portal.png';
import trekScanText from '../../assets/TrekScan_welomelogo.png';

// Login page component
function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
    
    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Password validation checks
  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
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
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      errors.password = 'Password must contain at least 1 special character';
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
        setFormErrors({ email: 'Email Validation Error' });
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
        setFormErrors({ password: 'incorrect password' });
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
        setFormErrors({ email: 'Email Validation Error' });
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={formErrors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: 20, color: '#6b7280' }} />
                ) : (
                  <Visibility sx={{ fontSize: 20, color: '#6b7280' }} />
                )}
              </button>
            </div>
            {formErrors.password && formErrors.password === 'incorrect password' && (
              <span className="field-error">{formErrors.password}</span>
            )}
            {formErrors.password && formErrors.password !== 'incorrect password' && (
              <span className="field-error">{formErrors.password}</span>
            )}
            {formData.password && !formErrors.password && (
              <div className="password-validation">
                <div className={`password-check ${passwordChecks.minLength ? 'valid' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {passwordChecks.minLength ? (
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    )}
                  </svg>
                  <span>Minimum 6 characters</span>
                </div>
                <div className={`password-check ${passwordChecks.hasSpecialChar ? 'valid' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {passwordChecks.hasSpecialChar ? (
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    )}
                  </svg>
                  <span>Atleast 1 special character</span>
                </div>
              </div>
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
