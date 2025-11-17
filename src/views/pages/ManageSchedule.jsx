import React, { useState } from 'react';
import '../style/ManageSchedule.css';

function ManageSchedule() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date(2019, 6, 1)); // July 2019
  const [selectedDay, setSelectedDay] = useState(13);
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
      day: 8,
      month: 'JUL',
      title: 'Mt. Hamiguitan Summit Trek',
      description: 'Trek event for participants',
      location: 'Mt. Hamiguitan',
      participants: 25,
      status: 'Active',
      type: 'Trek',
      color: '#30622f',
      time: '12:30 PM',
      price: 'Free'
    },
    {
      id: 2,
      day: 17,
      month: 'JUL',
      title: 'Beginners Hiking Workshop',
      description: 'Workshop event for participants',
      location: 'Mt. Hamiguitan Base Camp',
      participants: 15,
      status: 'Upcoming',
      type: 'Workshop',
      color: '#30622f',
      time: '6:30 PM',
      price: '₱500'
    },
    {
      id: 3,
      day: 22,
      month: 'JUL',
      title: 'Trail Cleanup Drive',
      description: 'Community event for participants',
      location: 'Mt. Hamiguitan Trails',
      participants: 40,
      status: 'Upcoming',
      type: 'Community',
      color: '#30622f',
      time: '6:00 PM',
      price: 'Free'
    },
    {
      id: 4,
      day: 25,
      month: 'JUL',
      title: 'Night Camping Experience',
      description: 'Camping event for participants',
      location: 'Mt. Hamiguitan Camp Site',
      participants: 18,
      status: 'Upcoming',
      type: 'Camping',
      color: '#30622f',
      time: '5:30 PM',
      price: '₱1,200'
    },
    {
      id: 5,
      day: 1,
      month: 'AUG',
      title: 'Wildlife Photography Tour',
      description: 'Training event for participants',
      location: 'Mt. Hamiguitan Range',
      participants: 12,
      status: 'Upcoming',
      type: 'Training',
      color: '#30622f',
      time: '9:00 AM',
      price: '₱800'
    }
  ];

  const pastEvents = [
    {
      id: 6,
      day: 2,
      month: 'AUG',
      year: 2024,
      title: 'Introduction to Blockchain Workshop',
      description: 'Learn the basics of blockchain technology',
      date: '02 Aug 2024'
    },
    {
      id: 7,
      day: 15,
      month: 'AUG',
      year: 2024,
      title: 'Introduction to Digital Marketing Workshop',
      description: 'Master digital marketing strategies',
      date: '15 Aug 2024'
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
      setSelectedDay(1); // Reset selected day when changing months
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
    <div className="manage-schedule-main">
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
        <div className="calendar-events-layout">
          {/* Left Column - Calendar */}
          <div className="calendar-left-column">
            <div className="calendar-section">
              <div className="calendar-header-simple">
                <button className="nav-arrow-simple" onClick={() => navigateMonth('prev')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h3 className="calendar-month-year-text">
                  {formatMonthYear(currentDate)}
                </h3>
                <button className="nav-arrow-simple" onClick={() => navigateMonth('next')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="calendar-grid-compact">
                <div className="calendar-weekdays-compact">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="weekday-compact">{day}</div>
                  ))}
                </div>
                <div className="calendar-days-compact">
                  {(() => {
                    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
                    const days = [];
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    
                    // Get previous month's last day
                    const prevMonth = new Date(year, month, 0);
                    const prevMonthDays = prevMonth.getDate();
                    
                    // Adjust starting day (Monday = 0, Sunday = 6)
                    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
                    
                    // Days from previous month
                    for (let i = adjustedStart - 1; i >= 0; i--) {
                      const day = prevMonthDays - i;
                      days.push(
                        <div key={`prev-${day}`} className="calendar-day-compact empty">
                          <div className="day-number-compact">{day}</div>
                        </div>
                      );
                    }
                    
                    // Days of the current month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dayEvents = getEventsForDay(day);
                      const hasEvents = dayEvents.length > 0;
                      const isSelected = day === selectedDay && currentDate.getMonth() === month;
                      
                      days.push(
                        <div 
                          key={day} 
                          className={`calendar-day-compact ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                          onClick={() => setSelectedDay(day)}
                        >
                          <div className="day-number-compact">{day}</div>
                          {hasEvents && <div className="event-dot"></div>}
                        </div>
                      );
                    }
                    
                    // Fill remaining cells with next month's days
                    const totalCells = days.length;
                    const cellsInGrid = Math.ceil(totalCells / 7) * 7;
                    const remainingCells = cellsInGrid - totalCells;
                    for (let i = 1; i <= remainingCells; i++) {
                      days.push(
                        <div key={`next-${i}`} className="calendar-day-compact empty">
                          <div className="day-number-compact">{i}</div>
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </div>
            
            {/* Past Events Section */}
            <div className="past-events-section">
              <h3 className="past-events-title">Past Event</h3>
              <div className="past-events-list">
                {pastEvents.map(event => (
                  <div key={event.id} className="past-event-item">
                    <h4 className="past-event-title">{event.title}</h4>
                    <p className="past-event-description">{event.description}</p>
                    <span className="past-event-date">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="events-right-column">
            <div className="upcoming-events-header">
              <button className="nav-arrow-simple" onClick={() => navigateMonth('prev')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h3 className="upcoming-events-title">Upcoming Event</h3>
              <button className="nav-arrow-simple" onClick={() => navigateMonth('next')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="upcoming-events-list">
              {events
                .filter(e => {
                  const eventMonth = currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  return (e.status === 'Upcoming' || e.status === 'Active') && e.month === eventMonth;
                })
                .sort((a, b) => a.day - b.day)
                .map(event => (
                <div key={event.id} className="upcoming-event-item">
                  <div className="upcoming-event-left">
                    <div className="upcoming-event-date">{event.day} {event.month}</div>
                    <div className="upcoming-event-time">{event.time}</div>
                    <div className="upcoming-event-price">{event.price}</div>
                  </div>
                  <div className="upcoming-event-content">
                    <div className="upcoming-event-location">{event.location}</div>
                    <h4 className="upcoming-event-title">{event.title}</h4>
                    <p className="upcoming-event-description">{event.description}</p>
                  </div>
                  <div className="upcoming-event-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
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

export default ManageSchedule;
