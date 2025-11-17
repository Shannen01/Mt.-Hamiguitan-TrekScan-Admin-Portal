import React, { useState, useEffect, useRef } from 'react';
import '../views/style/Dashboard.css';
import logoImage from '../assets/TrekScan.png';
import { Home } from 'lucide-react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { Event, InsertChart, AccountCircle, Settings as SettingsIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, DarkMode as DarkModeIcon, Hiking } from '@mui/icons-material';

import Dashboard from '../views/pages/Dashboard.jsx';
import ClimbRequest from '../views/pages/ClimbRequest.jsx';
import ManageSchedule from '../views/pages/ManageSchedule.jsx';
import Reports from '../views/pages/Reports.jsx';

function AppLayout({ onLogout }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'profile' | 'settings' | null
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // Store profile image as base64 or URL
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const actionsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const main = document.querySelector('.dashboard-main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeItem]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Close account menu on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
        setOpenModal(null);
        setShowProfileMenu(false);
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
        <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo-container">
              <img src={logoImage} alt="TrekScan+ Admin Portal" className="sidebar-logo" />
            </div>
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <nav className="sidebar-nav">
            <a
              className={`nav-item${activeItem === 'dashboard' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('dashboard'); }}
              title="Dashboard"
            >
              <Home size={18} strokeWidth={2} className="icon" aria-hidden="true" />
              <span>Dashboard</span>
            </a>
            <a
              className={`nav-item${activeItem === 'climb' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('climb'); }}
              title="Climb Request"
            >
              <Hiking className="icon" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>Climb Request</span>
            </a>
            <a
              className={`nav-item${activeItem === 'users' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('users'); }}
              title="Manage Schedule"
            >
              <Event className="icon" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>Manage Schedule</span>
            </a>
            <a
              className={`nav-item${activeItem === 'reports' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('reports'); }}
              title="Reports"
            >
              <InsertChart className="icon" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="main-content-header">
            <div className="header-left">
              <h1 className="page-title">
                {activeItem === 'dashboard' && 'Dashboard'}
                {activeItem === 'climb' && 'Climb Request'}
                {activeItem === 'users' && 'Manage Schedule'}
                {activeItem === 'reports' && 'Reports'}
              </h1>
            </div>
            <div className="header-right">
              {/* Notification Icon */}
              <button className="notification-icon-btn" aria-label="Notifications">
                <NotificationsIcon sx={{ fontSize: 24, color: '#6b7280' }} />
                <span className="notification-badge-dot"></span>
              </button>

              {/* Profile Section */}
              <div className="profile-container" ref={profileRef}>
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="Profile menu"
                >
                  <div className="profile-avatar">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <AccountCircle sx={{ fontSize: 40, color: '#6b7280' }} />
                    )}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">Administrator</div>
                  </div>
                </button>
                
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-avatar">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="profile-dropdown-image" />
                        ) : (
                          <AccountCircle sx={{ fontSize: 48, color: '#6b7280' }} />
                        )}
                      </div>
                      <div className="profile-dropdown-info">
                        <div className="profile-dropdown-name">Administrator</div>
                      </div>
                    </div>
                    <div className="profile-dropdown-divider"></div>
                    <button 
                      className="profile-menu-item"
                      onClick={() => {
                        setOpenModal('profile');
                        setShowProfileMenu(false);
                      }}
                    >
                      <AccountCircle sx={{ fontSize: 20 }} />
                      <span>My Profile</span>
                    </button>
                    <button 
                      className="profile-menu-item profile-menu-item-danger"
                      onClick={() => {
                        if (onLogout) {
                          onLogout();
                        }
                        setShowProfileMenu(false);
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 20 }} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          {activeItem === 'dashboard' && <Dashboard onNavigate={setActiveItem} />}
          {activeItem === 'climb' && <ClimbRequest />}
          {activeItem === 'users' && <ManageSchedule />}
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
              {openModal === 'profile' ? (
                <div className="profile-modal-content">
                  <div className="profile-modal-avatar-section">
                    <div className="profile-modal-avatar-large">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-modal-image" />
                      ) : (
                        <AccountCircle sx={{ fontSize: 120, color: '#6b7280' }} />
                      )}
                      <label className="profile-modal-image-upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <div className="profile-modal-upload-button">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Change Image
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="profile-modal-info">
                    <div className="profile-modal-field">
                      <label>Name</label>
                      <input type="text" defaultValue="Admin User" className="profile-input" />
                    </div>
                    <div className="profile-modal-field">
                      <label>Email</label>
                      <input type="email" defaultValue="admin@trekscan.com" className="profile-input" />
                    </div>
                    <div className="profile-modal-field">
                      <label>Role</label>
                      <input type="text" defaultValue="Administrator" className="profile-input" disabled />
                    </div>
                  </div>
                </div>
              ) : (
                <p>Placeholder content for {openModal}.</p>
              )}
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


