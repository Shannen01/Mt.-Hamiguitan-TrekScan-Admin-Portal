import React, { useState, useEffect, useRef } from 'react';
import '../views/style/Dashboard.css';
import logoImage from '../assets/Logo_admin_portal.png';
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
      <header className="dashboard-header">
        <div className="header-content">
          <img src={logoImage} alt="TrekScan+ Admin Portal" className="dashboard-logo" />
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
          {activeItem === 'dashboard' && <Dashboard />}
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


