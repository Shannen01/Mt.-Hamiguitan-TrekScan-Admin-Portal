import React, { useState } from 'react';
import '../style/EventManagement.css';

function EventManagement() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Trek',
    date: '',
    maxParticipants: '25',
    location: '',
    description: ''
  });

  const events = [
    {
      id: 1,
      day: 15,
      month: 'JUN',
      title: 'Mt. Hamiguitan Summit Trek',
      description: 'Trek event for participants',
      location: 'Mt. Hamiguitan',
      participants: 25,
      status: 'Active',
      type: 'Trek',
      color: '#93c5fd' // light blue (matches calendar display)
    },
    {
      id: 2,
      day: 22,
      month: 'JUN',
      title: 'Beginners Hiking Workshop',
      description: 'Workshop event for participants',
      location: 'Mt. Hamiguitan Base Camp',
      participants: 15,
      status: 'Upcoming',
      type: 'Workshop',
      color: '#c084fc' // light purple (matches calendar display)
    },
    {
      id: 3,
      day: 8,
      month: 'JUN',
      title: 'Trail Cleanup Drive',
      description: 'Community event for participants',
      location: 'Mt. Hamiguitan Trails',
      participants: 40,
      status: 'Completed',
      type: 'Community',
      color: '#86efac' // light green (matches calendar display)
    },
    {
      id: 4,
      day: 29,
      month: 'JUN',
      title: 'Night Camping Experience',
      description: 'Camping event for participants',
      location: 'Mt. Hamiguitan Camp Site',
      participants: 18,
      status: 'Upcoming',
      type: 'Camping',
      color: '#10b981' // dark green (matches calendar display)
    },
    {
      id: 5,
      day: 5,
      month: 'JUN',
      title: 'Wildlife Photography Tour',
      description: 'Training event for participants',
      location: 'Mt. Hamiguitan Range',
      participants: 12,
      status: 'Active',
      type: 'Training',
      color: '#fdba74' // light orange
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDay = (day) => {
    return events.filter(event => 
      event.day === day && 
      event.month === currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    );
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const getMonths = () => {
    return [
      { value: 0, label: 'January' },
      { value: 1, label: 'February' },
      { value: 2, label: 'March' },
      { value: 3, label: 'April' },
      { value: 4, label: 'May' },
      { value: 5, label: 'June' },
      { value: 6, label: 'July' },
      { value: 7, label: 'August' },
      { value: 8, label: 'September' },
      { value: 9, label: 'October' },
      { value: 10, label: 'November' },
      { value: 11, label: 'December' }
    ];
  };

  const getYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="event-management-main">
      <div className="event-header">
        <div className="view-toggles">
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Calendar View
          </button>
        </div>
        <button className="create-event-btn" onClick={() => setShowCreateForm(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create Event
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="events-section">
          <h2 className="events-section-title">Upcoming Events</h2>
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-date">
                  <div className="event-day">{event.day}</div>
                  <div className="event-month">{event.month}</div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-info">
                    <div className="event-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="event-participants">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                </div>
                <div className="event-status">
                  <span className={`status-badge ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-month-year-selectors">
              <select 
                className="month-selector"
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
              >
                {getMonths().map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <select 
                className="year-selector"
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
              >
                {getYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="calendar-navigation">
              <button className="nav-arrow" onClick={() => navigateMonth('prev')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="nav-arrow" onClick={() => navigateMonth('next')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {(() => {
                const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
                const days = [];
                
                // Empty cells for days before the first day of the month
                for (let i = 0; i < startingDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
                }
                
                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = day === 10 && currentDate.getMonth() === 5; // June 2025
                  
                  days.push(
                    <div 
                      key={day} 
                      className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="day-number">{day}</div>
                      <div className="day-events">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id} 
                            className="calendar-event"
                            style={{ backgroundColor: event.color }}
                            title={event.title}
                          >
                            {event.title.substring(0, 8)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
          </div>
          
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#6cbca2' }}></div>
              <span>Recreational</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
              <span>Research</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="create-event-modal" onClick={() => setShowCreateForm(false)}>
          <div className="create-event-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="create-event-title">Create New Event</h2>
            
            <form className="create-event-form" onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              console.log('Form submitted:', formData);
              setShowCreateForm(false);
            }}>
              <div className="form-field">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="Trek">Trek</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Camping">Camping</option>
                  <option value="Training">Training</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div className="form-field">
                <label>Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                  <svg className="calendar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              <div className="form-field">
                <label>Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  placeholder="Event description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="create-btn">Create Event</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventManagement;
