import React, { useState, useEffect } from 'react';
import { useViewModel } from '../../hooks/useViewModel.js';
import AuthViewModel from '../../viewmodels/AuthViewModel.js';
import ApiClient from '../../models/ApiClient.js';
import { config } from '../../config/config.js';
import '../style/Dashboard.css';
import logoImage from '../../assets/Logo_admin_portal.png';
import ClimbRequest from './ClimbRequest.jsx';
import UserManagement from './UserManagement.jsx';
import Reports from './Reports.jsx';

// Dashboard page component
function Dashboard({ onLogout }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  // Keep scroll behavior consistent: scroll main container to top on tab change
  useEffect(() => {
    const main = document.querySelector('.dashboard-main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeItem]);
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
          <img src={logoImage} alt="TrekScan+ Admin Portal" className="dashboard-logo" />
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
          </div>
          <nav className="sidebar-nav">
            <a
              className={`nav-item${activeItem === 'dashboard' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('dashboard'); }}
            >
              <span>Dashboard</span>
            </a>
            <a
              className={`nav-item${activeItem === 'climb' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('climb'); }}
            >
              <span>Climb Request</span>
            </a>
            <a
              className={`nav-item${activeItem === 'users' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('users'); }}
            >
              <span>User Management</span>
            </a>
            <a
              className={`nav-item${activeItem === 'reports' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('reports'); }}
            >
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeItem === 'dashboard' && (
            <div className="page-empty"></div>
          )}
          {activeItem === 'climb' && <ClimbRequest />}
          {activeItem === 'users' && <UserManagement />}
          {activeItem === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
