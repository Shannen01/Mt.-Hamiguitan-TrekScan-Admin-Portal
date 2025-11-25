import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../views/style/Dashboard.css';
import logoImage from '../assets/TrekScan.png';
import { Home } from 'lucide-react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { Event, InsertChart, AccountCircle, Settings as SettingsIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, DarkMode as DarkModeIcon, Hiking, Person, Lock, Close, Visibility, VisibilityOff, CalendarToday, CheckCircleOutline, Warning, PersonAdd, Delete, Search, CheckCircle, HighlightOff, Build } from '@mui/icons-material';
import { getAllBookings } from '../services/bookingService';
import { getUserById } from '../services/userService';
import { getCurrentUser, onAuthStateChange } from '../services/firebaseAuthService';
import { Timestamp } from 'firebase/firestore';

import Dashboard from '../views/pages/Dashboard.jsx';
import ClimbRequest from '../views/pages/ClimbRequest.jsx';
import ManageSchedule from '../views/pages/ManageSchedule.jsx';
import Reports from '../views/pages/Reports.jsx';
import Utility from '../views/pages/Utility.jsx';

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
  const [allBookings, setAllBookings] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all', 'unread', 'read'
  const [notificationSearch, setNotificationSearch] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const notificationRef = useRef(null);
  const actionsMenuRef = useRef(null);
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

  // Fetch bookings for notifications
  useEffect(() => {
    let intervalId = null;

    const fetchBookings = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const bookings = await getAllBookings();
        setAllBookings(bookings);
      } catch (error) {
        console.error('Error fetching bookings for notifications:', error);
      }
    };

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        fetchBookings();
        // Set up interval to check for new bookings every 30 seconds
        intervalId = setInterval(fetchBookings, 30000);
      } else {
        setAllBookings([]);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    });

    const currentUser = getCurrentUser();
    if (currentUser) {
      fetchBookings();
      intervalId = setInterval(fetchBookings, 30000);
    }

    return () => {
      unsubscribe();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Generate notifications from bookings
  const [notificationsList, setNotificationsList] = useState([]);
  
  useEffect(() => {
    const generateNotifications = async () => {
      const notifs = [];
      
      for (const booking of allBookings) {
        if (!booking.createdAt) continue;
        
        const createdAt = booking.createdAt instanceof Timestamp 
          ? booking.createdAt.toDate() 
          : new Date(booking.createdAt);
        
        // Fetch user data
        let user = null;
        if (booking.userId) {
          try {
            user = await getUserById(booking.userId);
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
        
        const userName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User';
        const trekDate = booking.trekDate instanceof Timestamp 
          ? booking.trekDate.toDate() 
          : new Date(booking.trekDate);
        const formattedDate = trekDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        // Calculate time ago
        const now = new Date();
        const timeDiff = now - createdAt;
        const minutesAgo = Math.floor(timeDiff / 60000);
        const hoursAgo = Math.floor(timeDiff / 3600000);
        
        let timeAgo = '';
        if (minutesAgo < 1) {
          timeAgo = 'Just now';
        } else if (minutesAgo < 60) {
          timeAgo = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
        } else if (hoursAgo < 24) {
          timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        } else {
          const daysAgo = Math.floor(hoursAgo / 24);
          timeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        }
        
        const status = booking.status?.toLowerCase();
        
        // New booking request notification (pending status)
        // Only show for new bookings, not for admin actions
        if (status === 'pending') {
          notifs.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            icon: 'calendar',
            iconColor: '#3b82f6',
            title: 'New Booking Request',
            description: `${userName} has requested to book Mt. Hamiguitan for ${formattedDate}`,
            timeAgo: timeAgo,
            timestamp: createdAt,
            isRead: readNotificationIds.has(`booking-${booking.id}`),
            bookingId: booking.id
          });
        }
        
        // Booking cancellation notification
        if (status === 'cancelled' && booking.updatedAt) {
          const updatedAt = booking.updatedAt instanceof Timestamp 
            ? booking.updatedAt.toDate() 
            : new Date(booking.updatedAt);
          const updateTimeDiff = now - updatedAt;
          
          // Only show cancellations from the last 7 days
          if (updateTimeDiff < 7 * 24 * 60 * 60 * 1000) {
            const updateMinutesAgo = Math.floor(updateTimeDiff / 60000);
            const updateHoursAgo = Math.floor(updateTimeDiff / 3600000);
            let updateTimeAgo = '';
            if (updateMinutesAgo < 1) {
              updateTimeAgo = 'Just now';
            } else if (updateMinutesAgo < 60) {
              updateTimeAgo = `${updateMinutesAgo} minute${updateMinutesAgo > 1 ? 's' : ''} ago`;
            } else if (updateHoursAgo < 24) {
              updateTimeAgo = `${updateHoursAgo} hour${updateHoursAgo > 1 ? 's' : ''} ago`;
            } else {
              const daysAgo = Math.floor(updateHoursAgo / 24);
              updateTimeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
            }
            
            const shortDate = trekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            notifs.push({
              id: `cancelled-${booking.id}`,
              type: 'cancelled',
              icon: 'circle',
              iconColor: '#f59e0b',
              title: 'Booking Cancelled',
              description: `${userName}'s booking for Mt. Hamiguitan on ${shortDate} has been cancelled`,
              timeAgo: updateTimeAgo,
              timestamp: updatedAt,
              isRead: readNotificationIds.has(`cancelled-${booking.id}`),
              bookingId: booking.id
            });
          }
        }
        
        // Booking update notifications for rejected and pending status
        // Only show if booking was updated after creation (indicating a status change or update)
        if ((status === 'rejected' || status === 'pending') && booking.updatedAt) {
          const updatedAt = booking.updatedAt instanceof Timestamp 
            ? booking.updatedAt.toDate() 
            : new Date(booking.updatedAt);
          const updateTimeDiff = now - updatedAt;
          
          // Only show updates from the last 7 days
          // And only if updatedAt is significantly different from createdAt (at least 1 minute difference)
          // This ensures we only show actual updates, not initial creation
          const createdAtTime = createdAt.getTime();
          const updatedAtTime = updatedAt.getTime();
          const timeDifference = updatedAtTime - createdAtTime;
          
          if (updateTimeDiff < 7 * 24 * 60 * 60 * 1000 && timeDifference > 60000) {
            const updateMinutesAgo = Math.floor(updateTimeDiff / 60000);
            const updateHoursAgo = Math.floor(updateTimeDiff / 3600000);
            let updateTimeAgo = '';
            if (updateMinutesAgo < 1) {
              updateTimeAgo = 'Just now';
            } else if (updateMinutesAgo < 60) {
              updateTimeAgo = `${updateMinutesAgo} minute${updateMinutesAgo > 1 ? 's' : ''} ago`;
            } else if (updateHoursAgo < 24) {
              updateTimeAgo = `${updateHoursAgo} hour${updateHoursAgo > 1 ? 's' : ''} ago`;
            } else {
              const daysAgo = Math.floor(updateHoursAgo / 24);
              updateTimeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
            }
            
            const statusText = status === 'rejected' ? 'rejected' : 'updated';
            const shortDate = trekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            notifs.push({
              id: `update-${booking.id}`,
              type: 'update',
              icon: status === 'rejected' ? 'warning' : 'calendar',
              iconColor: status === 'rejected' ? '#ef4444' : '#3b82f6',
              title: status === 'rejected' ? 'Booking Rejected' : 'Booking Updated',
              description: `${userName}'s booking for Mt. Hamiguitan on ${shortDate} has been ${statusText}`,
              timeAgo: updateTimeAgo,
              timestamp: updatedAt,
              isRead: readNotificationIds.has(`update-${booking.id}`),
              bookingId: booking.id
            });
          }
        }
      }
      
      // Sort by timestamp (newest first)
      setNotificationsList(notifs.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return timeB - timeA;
      }));
    };
    
    if (allBookings.length > 0) {
      generateNotifications();
    } else {
      setNotificationsList([]);
    }
  }, [allBookings, readNotificationIds]);

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notificationsList];
    
    // Apply status filter
    if (notificationFilter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (notificationFilter === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }
    
    // Apply search
    if (notificationSearch.trim()) {
      const searchTerm = notificationSearch.trim().toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm) || 
        n.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }, [notificationsList, notificationFilter, notificationSearch]);

  const unreadCount = notificationsList.filter(n => !n.isRead).length;
  const readCount = notificationsList.filter(n => n.isRead).length;

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setReadNotificationIds(prev => new Set([...prev, notificationId]));
  };

  // Mark all as read
  const markAllAsRead = () => {
    const allIds = notificationsList.map(n => n.id);
    setReadNotificationIds(prev => new Set([...prev, ...allIds]));
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotificationsList(prev => prev.filter(n => n.id !== notificationId));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotificationsList([]);
    setReadNotificationIds(new Set());
  };

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
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target)) {
        setShowActionsMenu(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
        setOpenModal(null);
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowActionsMenu(false);
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
            <a
              className={`nav-item${activeItem === 'utility' ? ' active' : ''}`}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveItem('utility'); }}
              title="Utility"
            >
              <Build className="icon" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>Utility</span>
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
                {activeItem === 'utility' && 'Utility'}
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
                  {unreadCount > 0 && <span className="notification-badge-dot"></span>}
                </button>
                
                {/* Notification Panel */}
                {showNotifications && (
                  <>
                    <div className="notification-backdrop" onClick={() => setShowNotifications(false)}></div>
                    <div className="notification-panel">
                      {/* Green Header */}
                      <div className="notification-panel-header-green">
                        <div className="notification-header-left">
                          <NotificationsIcon sx={{ fontSize: 24, color: '#ffffff' }} />
                          <h3 className="notification-header-title">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="notification-new-badge">{unreadCount} new</span>
                          )}
                        </div>
                        <button 
                          className="notification-close-btn-header"
                          onClick={() => setShowNotifications(false)}
                          aria-label="Close"
                        >
                          <Close sx={{ fontSize: 20, color: '#ffffff' }} />
                        </button>
                      </div>

                      {/* Filter Buttons */}
                      <div className="notification-filters">
                        <button 
                          className={`notification-filter-btn ${notificationFilter === 'all' ? 'active' : ''}`}
                          onClick={() => setNotificationFilter('all')}
                        >
                          All ({notificationsList.length})
                        </button>
                        <button 
                          className={`notification-filter-btn ${notificationFilter === 'unread' ? 'active' : ''}`}
                          onClick={() => setNotificationFilter('unread')}
                        >
                          Unread ({unreadCount})
                        </button>
                        <button 
                          className={`notification-filter-btn ${notificationFilter === 'read' ? 'active' : ''}`}
                          onClick={() => setNotificationFilter('read')}
                        >
                          Read ({readCount})
                        </button>
                        <div className="notification-actions-menu" ref={actionsMenuRef}>
                          <button 
                            className="notification-actions-menu-btn"
                            onClick={() => setShowActionsMenu(!showActionsMenu)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                            </svg>
                          </button>
                          {showActionsMenu && (
                            <div className="notification-actions-dropdown">
                              <button 
                                className="notification-actions-dropdown-item"
                                onClick={() => {
                                  markAllAsRead();
                                  setShowActionsMenu(false);
                                }}
                                disabled={unreadCount === 0}
                              >
                                <CheckCircle sx={{ fontSize: 18 }} />
                                <span>Mark all read</span>
                              </button>
                              <button 
                                className="notification-actions-dropdown-item notification-actions-dropdown-item-delete"
                                onClick={() => {
                                  clearAllNotifications();
                                  setShowActionsMenu(false);
                                }}
                                disabled={notificationsList.length === 0}
                              >
                                <Delete sx={{ fontSize: 18 }} />
                                <span>Delete all</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="notification-search-container">
                        <Search sx={{ fontSize: 18, color: '#6b7280' }} />
                        <input
                          type="text"
                          className="notification-search-input"
                          placeholder="Search notifications..."
                          value={notificationSearch}
                          onChange={(e) => setNotificationSearch(e.target.value)}
                        />
                      </div>
                      
                      {/* Notification List */}
                      <div className="notification-panel-content">
                        {filteredNotifications.length === 0 ? (
                          <div className="notification-empty-state">
                            <div className="notification-empty-icon">🔔</div>
                            <div className="notification-empty-title">No notifications</div>
                            <div className="notification-empty-subtitle">You're all caught up!</div>
                          </div>
                        ) : (
                          <div className="notification-list">
                            {filteredNotifications.map(notification => {
                              const getIcon = () => {
                                switch(notification.icon) {
                                  case 'calendar':
                                    return <CalendarToday sx={{ fontSize: 20, color: '#ffffff' }} />;
                                  case 'check':
                                    return <CheckCircleOutline sx={{ fontSize: 20, color: '#ffffff' }} />;
                                  case 'warning':
                                    return <Warning sx={{ fontSize: 20, color: '#ffffff' }} />;
                                  case 'circle':
                                    return <HighlightOff sx={{ fontSize: 20, color: '#ffffff' }} />;
                                  case 'user':
                                    return <PersonAdd sx={{ fontSize: 20, color: '#ffffff' }} />;
                                  default:
                                    return <NotificationsIcon sx={{ fontSize: 20, color: '#ffffff' }} />;
                                }
                              };

                              return (
                                <div 
                                  key={notification.id} 
                                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                >
                                  <div className="notification-item-icon" style={{ backgroundColor: notification.iconColor }}>
                                    {getIcon()}
                                  </div>
                                  <div className="notification-item-main">
                                    <div className="notification-item-content">
                                      <div className="notification-item-title">{notification.title}</div>
                                      <div className="notification-item-description">{notification.description}</div>
                                      <div className="notification-item-time">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px' }}>
                                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        {notification.timeAgo}
                                      </div>
                                    </div>
                                    <div className="notification-item-actions">
                                      {!notification.isRead && (
                                        <button 
                                          className="notification-mark-read-text-btn"
                                          onClick={() => markAsRead(notification.id)}
                                        >
                                          Mark read
                                        </button>
                                      )}
                                      <button 
                                        className="notification-delete-text-btn"
                                        onClick={() => deleteNotification(notification.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                  {!notification.isRead && (
                                    <span className="notification-unread-dot-indicator"></span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
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
                    setShowProfileMenu(!showProfileMenu);
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
                    <button 
                      className="profile-menu-item"
                      onClick={() => {
                        setOpenModal('profile');
                        setShowProfileMenu(false);
                      }}
                    >
                      <AccountCircle sx={{ fontSize: 20 }} />
                      <span>Profile</span>
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
          {activeItem === 'utility' && <Utility />}
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


