import React, { useState, useEffect, useRef } from 'react';
import '../views/style/Dashboard.css';
import logoImage from '../assets/TrekScan.png';
import { Home } from 'lucide-react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { Event, InsertChart, AccountCircle, Settings as SettingsIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, DarkMode as DarkModeIcon, Hiking, Person, Lock, Close, Visibility, VisibilityOff } from '@mui/icons-material';

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
  const [profileTab, setProfileTab] = useState('personal'); // 'personal' | 'login' | 'logout'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [profileData, setProfileData] = useState({
    firstName: 'Administrator',
    lastName: '',
    email: 'admin@trekscan.com',
    gender: 'male',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    location: '',
    postalCode: ''
  });
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
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
        setOpenModal(null);
        setShowProfileMenu(false);
        setShowNotifications(false);
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
              title="Booking Schedule"
            >
              <Event className="icon" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>Booking Schedule</span>
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
                {activeItem === 'users' && 'Booking Schedule'}
                {activeItem === 'reports' && 'Reports'}
              </h1>
            </div>
            <div className="header-right">
              {/* Notification Icon */}
              <div className="notification-container" ref={notificationRef}>
                <button 
                  className="notification-icon-btn" 
                  aria-label="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <NotificationsIcon sx={{ fontSize: 24, color: '#6b7280' }} />
                  <span className="notification-badge-dot"></span>
                </button>
                
                {/* Notification Panel */}
                {showNotifications && (
                  <>
                    <div className="notification-backdrop" onClick={() => setShowNotifications(false)}></div>
                    <div className="notification-panel">
                      <div className="notification-panel-header">
                        <h3>Notifications</h3>
                        <div className="notification-header-actions">
                          <button 
                            className="notification-mark-all-read"
                            onClick={() => {/* Mark all as read */}}
                          >
                            Mark all as read
                          </button>
                          <button 
                            className="notification-close-btn"
                            onClick={() => setShowNotifications(false)}
                            aria-label="Close"
                          >
                            <Close sx={{ fontSize: 20 }} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="notification-panel-content">
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '100%',
                          padding: '40px 20px',
                          textAlign: 'center',
                          color: '#6b7280'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🔔</div>
                          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>No notifications</div>
                          <div style={{ fontSize: '14px' }}>You're all caught up!</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Section */}
              <div className="profile-container" ref={profileRef}>
                <button 
                  className="profile-button"
                  onClick={() => {
                    setOpenModal('profile');
                    setShowProfileMenu(false);
                  }}
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
                        setShowLogoutConfirm(true);
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
          <div className="profile-modal-container" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button 
              className="profile-modal-close"
              onClick={() => setOpenModal(null)}
              aria-label="Close"
            >
              <Close sx={{ fontSize: 24 }} />
            </button>
            {openModal === 'profile' ? (
              <div className="profile-page-layout">
                {/* Left Sidebar */}
                <div className="profile-sidebar">
                  <div className="profile-sidebar-header">
                    <div className="profile-avatar-wrapper">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-avatar-img" />
                      ) : (
                        <AccountCircle sx={{ fontSize: 120, color: '#6b7280' }} />
                      )}
                      <label className="profile-avatar-edit">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </label>
                    </div>
                    <h2 className="profile-name">Administrator</h2>
                    <p className="profile-role">Administrator</p>
                  </div>
                  <nav className="profile-sidebar-nav">
                    <button 
                      className={`profile-nav-item ${profileTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setProfileTab('personal')}
                    >
                      <Person sx={{ fontSize: 20 }} />
                      <span>Personal Information</span>
                    </button>
                    <button 
                      className={`profile-nav-item ${profileTab === 'login' ? 'active' : ''}`}
                      onClick={() => setProfileTab('login')}
                    >
                      <Lock sx={{ fontSize: 20 }} />
                      <span>Login & Password</span>
                    </button>
                    <button 
                      className="profile-nav-item profile-nav-item-logout"
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setOpenModal(null);
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 20 }} />
                      <span>Log Out</span>
                    </button>
                  </nav>
                </div>

                {/* Right Content Area */}
                <div className="profile-content">
                  {profileTab === 'personal' && (
                    <>
                      <h1 className="profile-content-title">Personal Information</h1>
                      <div className="profile-form">
                        <div className="profile-form-section">
                          <label className="profile-form-label">Gender</label>
                          <div className="profile-radio-group">
                            <label className="profile-radio-label">
                              <input 
                                type="radio" 
                                name="gender" 
                                value="male" 
                                checked={profileData.gender === 'male'}
                                onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                              />
                              <span>Male</span>
                            </label>
                            <label className="profile-radio-label">
                              <input 
                                type="radio" 
                                name="gender" 
                                value="female"
                                checked={profileData.gender === 'female'}
                                onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                              />
                              <span>Female</span>
                            </label>
                          </div>
                        </div>

                        <div className="profile-form-row">
                          <div className="profile-form-field">
                            <label className="profile-form-label">First Name</label>
                            <input 
                              type="text" 
                              className="profile-form-input"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            />
                          </div>
                          <div className="profile-form-field">
                            <label className="profile-form-label">Last Name</label>
                            <input 
                              type="text" 
                              className="profile-form-input"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="profile-form-field">
                          <label className="profile-form-label">Email</label>
                          <input 
                            type="email" 
                            className="profile-form-input"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>

                        <div className="profile-form-field">
                          <label className="profile-form-label">Address</label>
                          <input 
                            type="text" 
                            className="profile-form-input"
                            value={profileData.address}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          />
                        </div>

                        <div className="profile-form-field">
                          <label className="profile-form-label">Phone Number</label>
                          <input 
                            type="tel" 
                            className="profile-form-input"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                          />
                        </div>


                        <div className="profile-form-actions">
                          <button 
                            className="profile-btn-discard"
                            onClick={() => setOpenModal(null)}
                          >
                            Discard Changes
                          </button>
                          <button 
                            className="profile-btn-save"
                            onClick={() => {
                              // Save logic here
                              setOpenModal(null);
                            }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {profileTab === 'login' && (
                    <div className="profile-content-section">
                      <h1 className="profile-content-title">Login & Password</h1>
                      <div className="profile-form">
                        <div className="profile-form-field">
                          <label className="profile-form-label">Current Password</label>
                          <div className="profile-password-wrapper">
                            <input 
                              type={showCurrentPassword ? "text" : "password"} 
                              className="profile-form-input profile-password-input" 
                            />
                            <button
                              type="button"
                              className="profile-password-toggle"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff sx={{ fontSize: 20, color: '#6b7280' }} />
                              ) : (
                                <Visibility sx={{ fontSize: 20, color: '#6b7280' }} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="profile-form-field">
                          <label className="profile-form-label">New Password</label>
                          <input type="password" className="profile-form-input" />
                        </div>
                        <div className="profile-form-field">
                          <label className="profile-form-label">Confirm New Password</label>
                          <input type="password" className="profile-form-input" />
                        </div>
                        <div className="profile-form-actions">
                          <button 
                            className="profile-btn-discard"
                            onClick={() => setOpenModal(null)}
                          >
                            Discard Changes
                          </button>
                          <button 
                            className="profile-btn-save"
                            onClick={() => setOpenModal(null)}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="modal-card">
            <div className="modal-header">
                  <h3>Settings</h3>
            </div>
            <div className="modal-body">
              <p>Placeholder content for {openModal}.</p>
            </div>
            <div className="modal-actions">
              <button className="action-btn" type="button" onClick={() => setOpenModal(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-confirm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="logout-confirm-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-confirm-body">
              <p>Are you sure you want to log out?</p>
            </div>
            <div className="logout-confirm-actions">
              <button 
                className="logout-btn-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="logout-btn-confirm"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  }
                  setShowLogoutConfirm(false);
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;


