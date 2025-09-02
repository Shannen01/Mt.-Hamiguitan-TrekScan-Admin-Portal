import React from 'react';
import { useViewModel } from '../../hooks/useViewModel.js';
import AuthViewModel from '../../viewmodels/AuthViewModel.js';
import ApiClient from '../../models/ApiClient.js';
import { config } from '../../config/config.js';
import '../style/Dashboard.css';

// Dashboard page component
function Dashboard({ onLogout }) {
  // Initialize ViewModel
  const apiClient = new ApiClient(config.api.baseURL);
  const authViewModel = new AuthViewModel(apiClient);
  
  // Connect ViewModel to React component
  const { auth, loading } = useViewModel(authViewModel);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;
    try {
      await authViewModel.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Trekscan Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {auth.user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body: sidebar left, main content right */}
      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="brand">TREKK+</span>
          </div>
          <nav className="sidebar-nav">
            <a className="nav-item active" href="#">
              <span>Dashboard</span>
            </a>
            <a className="nav-item" href="#">
              <span>Climb Request</span>
            </a>
            <a className="nav-item" href="#">
              <span>User Management</span>
            </a>
            <a className="nav-item" href="#">
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Users</h3>
              <p>Manage user accounts and permissions</p>
              <button className="card-button">View Users</button>
            </div>

            <div className="dashboard-card">
              <h3>Treks</h3>
              <p>Manage trek listings and content</p>
              <button className="card-button">View Treks</button>
            </div>

            <div className="dashboard-card">
              <h3>Analytics</h3>
              <p>View usage statistics and reports</p>
              <button className="card-button">View Analytics</button>
            </div>

            <div className="dashboard-card">
              <h3>Settings</h3>
              <p>Configure system settings</p>
              <button className="card-button">View Settings</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
