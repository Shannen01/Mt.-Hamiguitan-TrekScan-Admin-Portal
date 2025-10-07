import React, { useState, useEffect } from 'react';
import { useViewModel } from '../hooks/useViewModel.js';
import AuthViewModel from '../viewmodels/AuthViewModel.js';
import ApiClient from '../models/ApiClient.js';
import { config } from '../config/config.js';
import '../views/style/Dashboard.css';
import logoImage from '../assets/Logo_admin_portal.png';

import Dashboard from '../views/pages/Dashboard.jsx';
import ClimbRequest from '../views/pages/ClimbRequest.jsx';
import UserManagement from '../views/pages/UserManagement.jsx';
import Reports from '../views/pages/Reports.jsx';

function AppLayout() {
  const [activeItem, setActiveItem] = useState('dashboard');

  // Initialize ViewModel for auth-related header info and logout
  const apiClient = new ApiClient(config.api.baseURL);
  const authViewModel = new AuthViewModel(apiClient);
  const { auth, loading } = useViewModel(authViewModel);

  useEffect(() => {
    const main = document.querySelector('.dashboard-main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeItem]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;
    try {
      await authViewModel.logout();
      // After logout, a parent auth gate will swap this layout out
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <img src={logoImage} alt="TrekScan+ Admin Portal" className="dashboard-logo" />
          <div className="user-info">
            <span>Welcome, {auth?.user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-button" disabled={loading}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-header"></div>
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
          {activeItem === 'dashboard' && <Dashboard />}
          {activeItem === 'climb' && <ClimbRequest />}
          {activeItem === 'users' && <UserManagement />}
          {activeItem === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;


