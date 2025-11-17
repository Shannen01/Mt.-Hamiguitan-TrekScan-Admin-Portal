import React, { useState, useRef, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import '../style/ManageSchedule.css';

function ManageSchedule() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date(2022, 10, 1)); // November 2022
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'completed', 'approve', 'canceled', 'pending'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showMonthYearDropdown, setShowMonthYearDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef(null);
  const monthYearRef = useRef(null);

  const events = [
    {
      id: 1,
      day: 31,
      month: 'OCT',
      title: 'Trek Alliance',
      description: 'Design system update event',
      location: 'Mt. Hamiguitan',
      participants: 25,
      status: 'Active',
      type: 'Design',
      color: '#E9D5FF',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 2,
      day: 2,
      month: 'NOV',
      title: 'HighTrail Partners',
      description: 'Wireframe event',
      location: 'Mt. Hamiguitan Base Camp',
      participants: 15,
      status: 'Upcoming',
      type: 'Design',
      color: '#A7F3D0',
      time: '10:30 - 12:00',
      price: '₱500'
    },
    {
      id: 3,
      day: 3,
      month: 'NOV',
      title: 'Summit Explorers Network',
      description: 'Brand guideline event',
      location: 'Mt. Hamiguitan Trails',
      participants: 40,
      status: 'Upcoming',
      type: 'Brand',
      color: '#DDD6FE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 4,
      day: 4,
      month: 'NOV',
      title: 'EcoTrek Alliance',
      description: 'Brand guideline event',
      location: 'Mt. Hamiguitan Camp Site',
      participants: 18,
      status: 'Upcoming',
      type: 'Brand',
      color: '#DDD6FE',
      time: '10:30 - 12:00',
      price: '₱1,200'
    },
    {
      id: 5,
      day: 6,
      month: 'NOV',
      title: 'Mountain Path Association',
      description: 'Website design event',
      location: 'Mt. Hamiguitan Range',
      participants: 12,
      status: 'Upcoming',
      type: 'Website',
      color: '#FED7AA',
      time: '10:30 - 12:00',
      price: '₱800'
    },
    {
      id: 6,
      day: 8,
      month: 'NOV',
      title: 'Wilderness Trek Council',
      description: 'Product promotion event',
      location: 'Mt. Hamiguitan',
      participants: 20,
      status: 'Upcoming',
      type: 'Promotion',
      color: '#BFDBFE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 7,
      day: 10,
      month: 'NOV',
      title: 'Mountain Path Association',
      description: 'Website design event',
      location: 'Mt. Hamiguitan',
      participants: 15,
      status: 'Active',
      type: 'Website',
      color: '#FED7AA',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 8,
      day: 12,
      month: 'NOV',
      title: 'TrailGuard Affiliation',
      description: 'Product promotion event',
      location: 'Mt. Hamiguitan',
      participants: 18,
      status: 'Upcoming',
      type: 'Promotion',
      color: '#BFDBFE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 9,
      day: 14,
      month: 'NOV',
      title: 'Mountain Path Association',
      description: 'Website design event',
      location: 'Mt. Hamiguitan',
      participants: 22,
      status: 'Upcoming',
      type: 'Website',
      color: '#FED7AA',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 10,
      day: 16,
      month: 'NOV',
      title: 'Summit Explorers Network',
      description: 'Brand guideline event',
      location: 'Mt. Hamiguitan',
      participants: 25,
      status: 'Upcoming',
      type: 'Brand',
      color: '#DDD6FE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 11,
      day: 18,
      month: 'NOV',
      title: 'Mountain Path Association',
      description: 'Website design event',
      location: 'Mt. Hamiguitan',
      participants: 20,
      status: 'Upcoming',
      type: 'Website',
      color: '#FED7AA',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 12,
      day: 20,
      month: 'NOV',
      title: 'HighTrail Partners',
      description: 'Wireframe event',
      location: 'Mt. Hamiguitan',
      participants: 15,
      status: 'Upcoming',
      type: 'Design',
      color: '#A7F3D0',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 13,
      day: 22,
      month: 'NOV',
      title: 'TrailGuard Affiliation',
      description: 'Product promotion event',
      location: 'Mt. Hamiguitan',
      participants: 18,
      status: 'Upcoming',
      type: 'Promotion',
      color: '#BFDBFE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 14,
      day: 24,
      month: 'NOV',
      title: 'Peak Journey Collective',
      description: 'Real estate project event',
      location: 'Mt. Hamiguitan',
      participants: 30,
      status: 'Upcoming',
      type: 'Project',
      color: '#86EFAC',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 15,
      day: 26,
      month: 'NOV',
      title: 'TrailGuard Affiliation',
      description: 'Product promotion event',
      location: 'Mt. Hamiguitan',
      participants: 20,
      status: 'Upcoming',
      type: 'Promotion',
      color: '#BFDBFE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 16,
      day: 28,
      month: 'NOV',
      title: 'Summit Explorers Network',
      description: 'Brand guideline event',
      location: 'Mt. Hamiguitan',
      participants: 25,
      status: 'Upcoming',
      type: 'Brand',
      color: '#DDD6FE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 17,
      day: 30,
      month: 'NOV',
      title: 'HighTrail Partners',
      description: 'Wireframe event',
      location: 'Mt. Hamiguitan',
      participants: 15,
      status: 'Upcoming',
      type: 'Design',
      color: '#A7F3D0',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 18,
      day: 2,
      month: 'DEC',
      title: 'Summit Explorers Network',
      description: 'Brand guideline event',
      location: 'Mt. Hamiguitan',
      participants: 22,
      status: 'Upcoming',
      type: 'Brand',
      color: '#DDD6FE',
      time: '10:30 - 12:00',
      price: 'Free'
    },
    {
      id: 19,
      day: 4,
      month: 'DEC',
      title: 'Peak Journey Collective',
      description: 'Real estate project event',
      location: 'Mt. Hamiguitan',
      participants: 28,
      status: 'Upcoming',
      type: 'Project',
      color: '#86EFAC',
      time: '10:30 - 12:00',
      price: 'Free'
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

  const formatCurrentDay = (date, day) => {
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = day;
    const suffix = dayNumber === 1 || dayNumber === 21 || dayNumber === 31 ? 'st' :
                   dayNumber === 2 || dayNumber === 22 ? 'nd' :
                   dayNumber === 3 || dayNumber === 23 ? 'rd' : 'th';
    return `${dayName} ${dayNumber}${suffix}`;
  };

  const getDayOfWeek = (date, day) => {
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    return dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
    setShowMonthYearDropdown(false);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
    setShowMonthYearDropdown(false);
  };

  const formatMonthYearDisplay = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  const getFilterLabel = () => {
    switch(selectedFilter) {
      case 'all': return 'All Status';
      case 'completed': return 'Completed';
      case 'approve': return 'Approve';
      case 'canceled': return 'Canceled';
      case 'pending': return 'Pending';
      default: return 'All Status';
    }
  };

  // Calculate event counts by status
  const getEventCounts = () => {
    const eventMonth = currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const monthEvents = events.filter(e => e.month === eventMonth);
    
    // Map events to status categories
    // For now, using sample counts - in real app, events would have explicit status
    const completed = monthEvents.filter(e => e.status === 'Active' || e.id % 3 === 0).length || 12;
    const pending = monthEvents.filter(e => e.status === 'Upcoming' && e.id % 4 === 0).length || 5;
    const cancelled = monthEvents.filter(e => e.id % 7 === 0).length || 3;
    const approved = monthEvents.filter(e => e.status === 'Upcoming' && e.id % 5 === 0).length || 8;
    
    return {
      completed: completed,
      pending: pending,
      cancelled: cancelled,
      approved: approved
    };
  };

  const eventCounts = getEventCounts();
  const totalEvents = eventCounts.completed + eventCounts.pending + eventCounts.cancelled + eventCounts.approved;
  const overallProgress = totalEvents > 0 ? Math.round((eventCounts.completed / totalEvents) * 100) : 0;

  // Calculate slot availability for calendar view
  const getSlotAvailability = () => {
    const eventMonth = currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const monthEvents = events.filter(e => e.month === eventMonth);
    
    // Assume max capacity per day is 50 (can be adjusted)
    const MAX_CAPACITY = 50;
    
    let available = 0; // Green - 0-30% booked
    let limited = 0;   // Yellow/Orange - 30-80% booked
    let full = 0;      // Red - 80-100% booked
    
    // Group events by day
    const eventsByDay = {};
    monthEvents.forEach(event => {
      if (!eventsByDay[event.day]) {
        eventsByDay[event.day] = 0;
      }
      eventsByDay[event.day] += event.participants || 0;
    });
    
    // Count days by availability status
    Object.values(eventsByDay).forEach(participants => {
      const percentage = (participants / MAX_CAPACITY) * 100;
      if (percentage < 30) {
        available++;
      } else if (percentage < 80) {
        limited++;
      } else {
        full++;
      }
    });
    
    // Count days with no events as available
    const { daysInMonth } = getDaysInMonth(currentDate);
    const daysWithEvents = Object.keys(eventsByDay).length;
    available += (daysInMonth - daysWithEvents);
    
    return { available, limited, full };
  };

  const slotAvailability = getSlotAvailability();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
      if (monthYearRef.current && !monthYearRef.current.contains(e.target)) {
        setShowMonthYearDropdown(false);
      }
    }
    if (showFilterDropdown || showMonthYearDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterDropdown, showMonthYearDropdown]);

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
      </div>

      {viewMode === 'list' ? (
        <div>
          {/* Filter Section */}
          <div className="schedule-filters-section">
            <div className="schedule-left-filters">
              <div className="schedule-date-range-selector" ref={monthYearRef}>
                <button 
                  className="month-year-selector-btn"
                  onClick={() => setShowMonthYearDropdown(!showMonthYearDropdown)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="calendar-icon-filter">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                  <span className="date-range-text">{formatMonthYearDisplay(currentDate)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="chevron-down">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                </button>
                {showMonthYearDropdown && (
                  <div className="month-year-dropdown-menu">
                    <div className="month-year-selectors">
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
                  </div>
                )}
              </div>
              <div className="schedule-search-container">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  className="schedule-search-input"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="schedule-filters-group" ref={filterRef}>
              <div className="filter-dropdown-container">
                <button 
                  className="filter-dropdown-btn"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="filter-icon">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Filters
                </button>
                {showFilterDropdown && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-dropdown-header">FILTER BY STATUS</div>
                    <button 
                      className={`filter-dropdown-item ${selectedFilter === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFilter('all');
                        setShowFilterDropdown(false);
                      }}
                    >
                      <FilterListAltIcon className="filter-icon-all" />
                      All Status
                    </button>
                    <button 
                      className={`filter-dropdown-item ${selectedFilter === 'completed' ? 'active' : ''}`}
                      data-filter="completed"
                      onClick={() => {
                        setSelectedFilter('completed');
                        setShowFilterDropdown(false);
                      }}
                    >
                      <CheckCircleIcon className="filter-icon-completed" />
                      Completed
                    </button>
                    <button 
                      className={`filter-dropdown-item ${selectedFilter === 'approve' ? 'active' : ''}`}
                      data-filter="approve"
                      onClick={() => {
                        setSelectedFilter('approve');
                        setShowFilterDropdown(false);
                      }}
                    >
                      <TaskAltIcon className="filter-icon-approve" />
                      Approve
                    </button>
                    <button 
                      className={`filter-dropdown-item ${selectedFilter === 'canceled' ? 'active' : ''}`}
                      data-filter="canceled"
                      onClick={() => {
                        setSelectedFilter('canceled');
                        setShowFilterDropdown(false);
                      }}
                    >
                      <HighlightOffIcon className="filter-icon-canceled" />
                      Canceled
                    </button>
                    <button 
                      className={`filter-dropdown-item ${selectedFilter === 'pending' ? 'active' : ''}`}
                      data-filter="pending"
                      onClick={() => {
                        setSelectedFilter('pending');
                        setShowFilterDropdown(false);
                      }}
                    >
                      <AccessTimeIcon className="filter-icon-pending" />
                      Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
            
            {/* Slot Availability Indicator */}
            <div className="slot-availability-indicator slot-availability-compact">
              <div className="slot-indicator-item">
                <div className="slot-indicator-line available"></div>
                <span className="slot-indicator-label">Available</span>
              </div>
              <div className="slot-indicator-item">
                <div className="slot-indicator-line limited"></div>
                <span className="slot-indicator-label">Limited Slots</span>
              </div>
              <div className="slot-indicator-item">
                <div className="slot-indicator-line full"></div>
                <span className="slot-indicator-label">Full</span>
              </div>
            </div>
            
            {/* Category Buttons */}
            <div className="calendar-categories">
              <h3 className="categories-title">Categories</h3>
              
              {/* Status Cards */}
              <div className="category-status-cards">
                <div className="category-status-left">
                  <button 
                    className={`category-status-card completed ${selectedFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('completed')}
                  >
                    <div className="category-status-icon" style={{ backgroundColor: '#10b981' }}>
                      <CheckCircleIcon style={{ color: '#ffffff', fontSize: '20px' }} />
                    </div>
                    <div className="category-status-info">
                      <div className="category-status-title">Completed</div>
                      <div className="category-status-count">{eventCounts.completed} total bookings</div>
                    </div>
                    <div className="category-status-indicator" style={{ backgroundColor: '#10b981' }}></div>
                  </button>
                  
                  <button 
                    className={`category-status-card canceled ${selectedFilter === 'canceled' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('canceled')}
                  >
                    <div className="category-status-icon" style={{ backgroundColor: '#ef4444' }}>
                      <HighlightOffIcon style={{ color: '#ffffff', fontSize: '20px' }} />
                    </div>
                    <div className="category-status-info">
                      <div className="category-status-title">Cancelled</div>
                      <div className="category-status-count">{eventCounts.cancelled} total bookings</div>
                    </div>
                    <div className="category-status-indicator" style={{ backgroundColor: '#ef4444' }}></div>
                  </button>
                </div>
                
                <div className="category-status-right">
                  <button 
                    className={`category-status-card pending ${selectedFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('pending')}
                  >
                    <div className="category-status-icon" style={{ backgroundColor: '#f59e0b' }}>
                      <AccessTimeIcon style={{ color: '#ffffff', fontSize: '20px' }} />
                    </div>
                    <div className="category-status-info">
                      <div className="category-status-title">Pending</div>
                      <div className="category-status-count">{eventCounts.pending} total bookings</div>
                    </div>
                    <div className="category-status-indicator" style={{ backgroundColor: '#f59e0b' }}></div>
                  </button>
                  
                  <button 
                    className={`category-status-card approve ${selectedFilter === 'approve' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('approve')}
                  >
                    <div className="category-status-icon" style={{ backgroundColor: '#3b82f6' }}>
                      <TaskAltIcon style={{ color: '#ffffff', fontSize: '20px' }} />
                    </div>
                    <div className="category-status-info">
                      <div className="category-status-title">Approved</div>
                      <div className="category-status-count">{eventCounts.approved} total bookings</div>
                    </div>
                    <div className="category-status-indicator" style={{ backgroundColor: '#3b82f6' }}></div>
                  </button>
                </div>
              </div>
              
              {/* Summary Card */}
              <div className="category-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Total Bookings</span>
                  <span className="summary-value">{totalEvents}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Overall Progress</span>
                  <span className="summary-value">{overallProgress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-segment completed" 
                      style={{ width: `${(eventCounts.completed / totalEvents) * 100}%` }}
                    ></div>
                    <div 
                      className="progress-segment pending" 
                      style={{ width: `${(eventCounts.pending / totalEvents) * 100}%` }}
                    ></div>
                    <div 
                      className="progress-segment approved" 
                      style={{ width: `${(eventCounts.approved / totalEvents) * 100}%` }}
                    ></div>
                    <div 
                      className="progress-segment cancelled" 
                      style={{ width: `${(eventCounts.cancelled / totalEvents) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="progress-legend">
                  <div className="legend-left">
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: '#10b981' }}></div>
                      <span>Completed</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
                      <span>Cancelled</span>
                    </div>
                  </div>
                  <div className="legend-right">
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                      <span>Pending</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></div>
                      <span>Approved</span>
                    </div>
                  </div>
                </div>
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
              <h3 className="upcoming-events-title">Scheduled Bookings</h3>
              <button className="nav-arrow-simple" onClick={() => navigateMonth('next')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="upcoming-events-list">
              {(() => {
                const eventMonth = currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const filteredEvents = events
                  .filter(e => {
                    return (e.status === 'Upcoming' || e.status === 'Active') && e.month === eventMonth;
                  })
                  .sort((a, b) => a.day - b.day);
                
                if (filteredEvents.length === 0) {
                  return (
                    <div className="no-bookings-message">
                      <EventNoteIcon className="no-bookings-icon" />
                      <p>No scheduled booking for this month</p>
                    </div>
                  );
                }
                
                return filteredEvents.map(event => {
                  // Map status: Upcoming -> pending, Active -> approved
                  // For demo, we'll use the existing status and map it
                  const getStatusDisplay = (status) => {
                    if (status === 'Upcoming') return 'Pending';
                    if (status === 'Active') return 'Approved';
                    return status;
                  };
                  
                  const statusDisplay = getStatusDisplay(event.status);
                  
                  return (
                    <div key={event.id} className="upcoming-event-item">
                      <div className="upcoming-event-left">
                        <div className="upcoming-event-date">{event.day} {event.month}</div>
                      </div>
                      <div className="upcoming-event-content">
                        <div className="upcoming-event-location">Mt. Hamiguitan</div>
                        <div className="upcoming-event-affiliation">{event.title}</div>
                        <div className="upcoming-event-trekkers">{event.participants} Trekkers</div>
                      </div>
                      <div className="upcoming-event-right">
                        <div className={`upcoming-event-status status-${statusDisplay.toLowerCase()}`} data-status={statusDisplay}>{statusDisplay}</div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
          </div>
        </div>
      ) : (
        <div className="calendar-view-container">
          {/* Calendar Header */}
          <div className="calendar-view-header">
            <div className="calendar-current-day">
              <h2>{formatCurrentDay(currentDate, selectedDay)}</h2>
            </div>
            <div className="calendar-month-navigation">
              <button className="calendar-nav-arrow" onClick={() => navigateMonth('prev')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="calendar-month-year-display">
                {formatMonthYear(currentDate)}
              </span>
              <button className="calendar-nav-arrow" onClick={() => navigateMonth('next')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="calendar-view-grid">
            <div className="calendar-weekdays-header">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const currentDayOfWeek = getDayOfWeek(currentDate, selectedDay);
                const dayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Convert Sunday=0 to Monday=0
                const isCurrentDay = index === dayIndex;
                return (
                  <div key={day} className={`calendar-weekday-header ${isCurrentDay ? 'highlighted' : ''}`}>
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="calendar-days-grid">
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
                    <div key={`prev-${day}`} className="calendar-day-cell other-month">
                      <div className="calendar-day-number">{day}</div>
                    </div>
                  );
                }
                
                // Days of the current month
                for (let day = 1; day <= daysInMonth; day++) {
                  const isSelected = day === selectedDay;
                  
                  days.push(
                    <div 
                      key={day} 
                      className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="calendar-day-number">{day}</div>
                          </div>
                  );
                }
                
                // Fill remaining cells with next month's days
                const totalCells = days.length;
                const cellsInGrid = Math.ceil(totalCells / 7) * 7;
                const remainingCells = cellsInGrid - totalCells;
                for (let i = 1; i <= remainingCells; i++) {
                  days.push(
                    <div key={`next-${i}`} className="calendar-day-cell other-month">
                      <div className="calendar-day-number">{i}</div>
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
          </div>
          
          {/* Slot Availability Indicator */}
          <div className="slot-availability-indicator">
            <div className="slot-indicator-item">
              <div className="slot-indicator-line available"></div>
              <span className="slot-indicator-label">Available</span>
            </div>
            <div className="slot-indicator-item">
              <div className="slot-indicator-line limited"></div>
              <span className="slot-indicator-label">Limited Slots</span>
            </div>
            <div className="slot-indicator-item">
              <div className="slot-indicator-line full"></div>
              <span className="slot-indicator-label">Full</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageSchedule;
