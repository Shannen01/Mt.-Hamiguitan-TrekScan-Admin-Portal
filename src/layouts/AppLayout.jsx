import React, { useState, useEffect, useRef } from 'react';
import '../views/style/Dashboard.css';
import logoImage from '../assets/TrekScan.png';
import { Home, Mountain, Users, BarChart3 } from 'lucide-react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { CalendarToday, AccountCircle, Settings as SettingsIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';

import Dashboard from '../views/pages/Dashboard.jsx';
import ClimbRequest from '../views/pages/ClimbRequest.jsx';
import EventManagement from '../views/pages/EventManagement.jsx';
import Reports from '../views/pages/Reports.jsx';

function AppLayout({ onLogout }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'profile' | 'settings' | null
  const actionsRef = useRef(null);

  useEffect(() => {
    const main = document.querySelector('.dashboard-main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeItem]);

  // Close account menu on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
        setOpenModal(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-container">
              <img src={logoImage} alt="TrekScan+ Admin Portal" className="sidebar-logo" />
            </div>
          </div>
          <nav className="sidebar-nav">
            <a
              className={`nav-item${activeItem === 'dashboard' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('dashboard'); }}
            >
              <Home size={18} strokeWidth={2} className="icon" aria-hidden="true" />
              <span>Dashboard</span>
            </a>
            <a
              className={`nav-item${activeItem === 'climb' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('climb'); }}
            >
              <Mountain size={18} strokeWidth={2} className="icon" aria-hidden="true" />
              <span>Climb Request</span>
            </a>
            <a
              className={`nav-item${activeItem === 'users' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('users'); }}
            >
              <Users size={18} strokeWidth={2} className="icon" aria-hidden="true" />
              <span>Event Management</span>
            </a>
            <a
              className={`nav-item${activeItem === 'reports' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('reports'); }}
            >
              <BarChart3 size={18} strokeWidth={2} className="icon" aria-hidden="true" />
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="main-content-header">
            <div className="header-left">
              <h1 className="page-title">Request Management</h1>
            </div>
            <div className="header-content">
              <div className="header-right">
                <div className="notification-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="notification-badge"></span>
                </div>
                <div className="header-separator"></div>
                <div className="user-info-header">
                  <div className="user-text">
                    <div className="user-name">Admin User</div>
                    <div className="user-role">Administrator</div>
                  </div>
                  <div className="user-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {activeItem === 'dashboard' && <Dashboard onNavigate={setActiveItem} />}
          {activeItem === 'climb' && <ClimbRequest />}
          {activeItem === 'users' && <EventManagement />}
          {activeItem === 'reports' && <Reports />}
        </main>
      </div>

      {openModal && (
        <div className="modal-backdrop" onClick={() => setOpenModal(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{openModal === 'profile' ? 'My Profile' : 'Settings'}</h3>
            </div>
            <div className="modal-body">
              <p>Placeholder content for {openModal}.</p>
            </div>
            <div className="modal-actions">
              <button className="action-btn" type="button" onClick={() => setOpenModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;


