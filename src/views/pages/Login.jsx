import React, { useState, useEffect } from 'react';
import { useViewModel } from '../../hooks/useViewModel.js';
import AuthViewModel from '../../viewmodels/AuthViewModel.js';
import ApiClient from '../../models/ApiClient.js';
import { config } from '../../config/config.js';
import '../style/Login.css';

// Login page component
function Login({ onLoginSuccess }) {
  // Initialize ViewModel
  const apiClient = new ApiClient(config.api.baseURL);
  const authViewModel = new AuthViewModel(apiClient);
  
  // Connect ViewModel to React component
  const { loading, error, isAuthenticated } = useViewModel(authViewModel);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

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
    
    if (!validateForm()) {
      return;
    }

    // Temporary: Navigate to dashboard immediately after validation
    if (onLoginSuccess) {
      onLoginSuccess();
      return;
    }

    // If you want real API auth later, uncomment:
    // try {
    //   await authViewModel.login(formData);
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Trekscan Admin</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
