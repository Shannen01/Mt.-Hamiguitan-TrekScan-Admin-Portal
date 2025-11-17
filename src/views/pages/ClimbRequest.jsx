import React, { useState, useRef, useEffect } from 'react';
import '../style/ClimbRequest.css';
import { 
  getAllBookings, 
  getBookingById, 
  updateBookingStatus,
  searchBookings,
  subscribeToBookings,
  formatBookingDate
} from '../../services/bookingService';
import { getUserById } from '../../services/userService';
import { getCurrentUser, onAuthStateChange } from '../../services/firebaseAuthService';
import Attachment from '../../models/Attachment';

function ClimbRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all-time'); // Changed to 'all-time' to show all bookings by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const filtersRef = useRef(null);
  const exportRef = useRef(null);
  const monthRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    email: '',
    affiliation: '',
    numberOfPorters: '',
    purposeOfClimb: ''
  });
  const [adminNote, setAdminNote] = useState('');

  // Climb requests from Firebase
  const [requests, setRequests] = useState([]);

  // Fetch bookings from Firebase and map to UI format
  const fetchClimbRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookings with filters:', { selectedStatus, selectedMonth });
      
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus.toLowerCase() : null
      };
      
      // Add month filter if needed
      if (selectedMonth !== 'all-time') {
        const now = new Date();
        if (selectedMonth === 'this-month') {
          filters.month = now.getMonth() + 1;
          filters.year = now.getFullYear();
        } else if (selectedMonth === 'last-month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          filters.month = lastMonth.getMonth() + 1;
          filters.year = lastMonth.getFullYear();
        } else if (selectedMonth === 'this-year') {
          filters.year = now.getFullYear();
        }
      }
      
      console.log('Calling getAllBookings with filters:', filters);
      let fetchedBookings = await getAllBookings(filters);
      console.log('Fetched bookings:', fetchedBookings?.length || 0, fetchedBookings);
      
      // Apply search filter if search term exists
      if (searchTerm) {
        console.log('Applying search filter:', searchTerm);
        fetchedBookings = await searchBookings(searchTerm, filters);
        console.log('After search, bookings:', fetchedBookings?.length || 0);
      }
      
      if (!fetchedBookings || fetchedBookings.length === 0) {
        console.log('No bookings found');
        setRequests([]);
        setLoading(false);
        return;
      }
      
      // Fetch user data for each booking and map to UI format
      console.log('Processing bookings and fetching user data...');
      const requestsWithUserData = await Promise.all(
        fetchedBookings.map(async (booking) => {
          try {
            // Fetch user data
            const user = booking.userId ? await getUserById(booking.userId) : null;
            
            // Map BookingModel to UI format
            return {
              id: booking.id,
              requestId: booking.id,
              userId: booking.userId,
              name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User',
              email: user?.email || 'N/A',
              phone: 'N/A', // UserModel doesn't have phone, might need to add
              phoneNumber: 'N/A',
              age: user?.birthDate ? calculateAge(user.birthDate) : 'N/A',
              affiliation: booking.affiliation || 'N/A',
              numberOfPorters: booking.numberOfPorters || 0,
              purposeOfClimb: booking.notes || booking.trekType || 'N/A',
              requestedDate: formatBookingDate(booking.trekDate, 'short'),
              dateSubmitted: formatBookingDate(booking.createdAt, 'short'),
              status: capitalizeStatus(booking.status),
              documents: booking.attachments || [],
              attachments: booking.attachments || [],
              adminNotes: booking.adminNotes || '',
              lastAdminNote: booking.adminNotes || '',
              trekType: booking.trekType,
              // Keep original booking for reference
              _booking: booking
            };
          } catch (userErr) {
            console.error('Error processing booking:', booking.id, userErr);
            // Return booking even if user fetch fails
            return {
              id: booking.id,
              requestId: booking.id,
              userId: booking.userId,
              name: 'Unknown User',
              email: 'N/A',
              phone: 'N/A',
              phoneNumber: 'N/A',
              age: 'N/A',
              affiliation: booking.affiliation || 'N/A',
              numberOfPorters: booking.numberOfPorters || 0,
              purposeOfClimb: booking.notes || booking.trekType || 'N/A',
              requestedDate: formatBookingDate(booking.trekDate, 'short'),
              dateSubmitted: formatBookingDate(booking.createdAt, 'short'),
              status: capitalizeStatus(booking.status),
              documents: booking.attachments || [],
              attachments: booking.attachments || [],
              adminNotes: booking.adminNotes || '',
              lastAdminNote: booking.adminNotes || '',
              trekType: booking.trekType,
              _booking: booking
            };
          }
        })
      );
      
      console.log('Mapped requests:', requestsWithUserData.length);
      setRequests(requestsWithUserData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      console.error('Error details:', err.message, err.stack);
      setError(`Failed to load climb requests: ${err.message || 'Unknown error'}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age.toString();
    } catch {
      return 'N/A';
    }
  };

  // Helper function to capitalize status for display
  const capitalizeStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Check authentication and load requests on component mount and when filters change
  useEffect(() => {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Please log in to view climb requests.');
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChange((user) => {
      if (!user) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        setRequests([]);
      } else {
        // User is authenticated, fetch requests
        fetchClimbRequests();
      }
    });

    // Fetch requests if authenticated
    if (currentUser) {
      fetchClimbRequests();
    }

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, selectedMonth]);

  const handleActionClick = async (requestId, action) => {
    if (action === 'view') {
      try {
        setLoadingDetails(true);
        console.log('Fetching booking details for:', requestId);
        
        if (!requestId) {
          throw new Error('Request ID is missing');
        }
        
        const booking = await getBookingById(requestId);
        console.log('Booking fetched:', booking);
        
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        // Fetch user data
        const user = booking.userId ? await getUserById(booking.userId) : null;
        console.log('User data:', user);
        
        // Map booking to UI format
        const request = {
          id: booking.id,
          requestId: booking.id,
          userId: booking.userId,
          name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User',
          email: user?.email || 'N/A',
          phone: 'N/A',
          phoneNumber: 'N/A',
          age: user?.birthDate ? calculateAge(user.birthDate) : 'N/A',
          affiliation: booking.affiliation || 'N/A',
          numberOfPorters: booking.numberOfPorters || 0,
          purposeOfClimb: booking.notes || booking.trekType || 'N/A',
          requestedDate: formatBookingDate(booking.trekDate, 'short'),
          dateSubmitted: formatBookingDate(booking.createdAt, 'short'),
          status: capitalizeStatus(booking.status),
          documents: booking.attachments || [],
          attachments: booking.attachments || [],
          adminNotes: booking.adminNotes || '',
          lastAdminNote: booking.adminNotes || '',
          trekType: booking.trekType,
          _booking: booking
        };
        
        setSelectedRequest({
          ...request,
          requestedDate: formatBookingDate(booking.trekDate, 'short'),
          dateSubmitted: formatBookingDate(booking.createdAt, 'short')
        });
        
        // Populate form with request data
        setFormData({
          fullName: request.name || '',
          phoneNumber: request.phoneNumber || '',
          age: request.age || '',
          email: request.email || '',
          affiliation: request.affiliation || '',
          numberOfPorters: request.numberOfPorters ? String(request.numberOfPorters) : '',
          purposeOfClimb: request.purposeOfClimb || ''
        });
        
        // Map attachments to documents format for display
        const documents = (booking.attachments || []).map(att => {
          try {
            // Handle both Attachment instances and plain objects
            let attachment;
            if (att instanceof Attachment) {
              attachment = att;
            } else if (att && typeof att === 'object') {
              attachment = Attachment.fromMap(att);
            } else {
              // If att is just a string URL or something else
              attachment = Attachment.fromMap({ downloadURL: att || '' });
            }
            
            return {
              name: attachment?.fileName || attachment?.name || 'Unknown',
              fileName: attachment?.fileName || attachment?.name || 'Unknown',
              url: attachment?.downloadURL || attachment?.url || '',
              downloadURL: attachment?.downloadURL || attachment?.url || '',
              type: attachment?.mimeType || attachment?.type || 'application/octet-stream',
              mimeType: attachment?.mimeType || attachment?.type || 'application/octet-stream',
              size: attachment?.size || 0
            };
          } catch (attErr) {
            console.error('Error processing attachment:', att, attErr);
            // Return a safe default
            return {
              name: 'Unknown',
              fileName: 'Unknown',
              url: att?.downloadURL || att?.url || '',
              downloadURL: att?.downloadURL || att?.url || '',
              type: 'application/octet-stream',
              mimeType: 'application/octet-stream',
              size: 0
            };
          }
        });
        setUploadedFiles(documents);
        setAdminNote(booking.adminNotes || '');
        console.log('Setting selected request and showing modal');
        setShowDetailsModal(true);
        setLoadingDetails(false);
      } catch (err) {
        console.error('Error fetching request details:', err);
        console.error('Error stack:', err.stack);
        setLoadingDetails(false);
        alert(`Failed to load request details: ${err.message || 'Unknown error'}`);
      }
    } else if (action === 'approve' || action === 'reject' || action === 'pending') {
      try {
        // Map UI status to BookingModel status (lowercase)
        const statusMap = {
          'approve': 'approved',
          'reject': 'rejected',
          'pending': 'pending'
        };
        const bookingStatus = statusMap[action] || 'pending';
        
        await updateBookingStatus(requestId, bookingStatus);
        
        // Update local state with capitalized status for display
        const displayStatus = capitalizeStatus(bookingStatus);
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { ...request, status: displayStatus }
              : request
          )
        );
        
        // Update selected request if modal is open
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: displayStatus });
        }
      } catch (err) {
        console.error('Error updating request status:', err);
        alert('Failed to update request status. Please try again.');
      }
    }
  };

  const handleFileOpen = (file) => {
    // Handle both old format (file.url) and new format (file.downloadURL or file.url)
    const url = file.downloadURL || file.url;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
          <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFiltersMenu(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setShowMonthMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (format) => {
    // Export functionality
    console.log(`Exporting as ${format}`);
    alert(`Exporting data as ${format.toUpperCase()}...`);
    setShowExportMenu(false);
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    setShowFiltersMenu(false);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setShowMonthMenu(false);
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchClimbRequests();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Filter requests locally for search (or use the service)
  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      request.name?.toLowerCase().includes(lowerSearchTerm) ||
      request.id?.toLowerCase().includes(lowerSearchTerm) ||
      request.userId?.toLowerCase().includes(lowerSearchTerm) ||
      request.email?.toLowerCase().includes(lowerSearchTerm) ||
      request.requestId?.toLowerCase().includes(lowerSearchTerm) ||
      request.affiliation?.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div className="climb-main">
        {/* Error Display */}
        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Request Management Card */}
        <div className="request-management-card">
          <div className="card-header">
          </div>
          
          {/* Table Header with Search and Actions */}
          <div className="table-header-bar">
            <div className="table-search-container">
              <svg className="table-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                className="table-search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="table-actions">
              {/* Filters Dropdown */}
              <div className="table-action-dropdown" ref={filtersRef}>
                <button className="table-action-btn" onClick={() => setShowFiltersMenu(!showFiltersMenu)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="8" cy="6" r="2" fill="currentColor"/>
                    <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="18" r="2" fill="currentColor"/>
                  </svg>
                  Filters
                </button>
                {showFiltersMenu && (
                  <div className="action-dropdown-menu">
                    <div className="dropdown-header">Filter by Status</div>
                    <button 
                      className={`dropdown-item ${selectedStatus === 'all' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('all')}
                    >
                      All Status
                    </button>
                    <button 
                      className={`dropdown-item ${selectedStatus === 'pending' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('pending')}
                    >
                      Pending
                    </button>
                    <button 
                      className={`dropdown-item ${selectedStatus === 'approved' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('approved')}
                    >
                      Approved
                    </button>
                    <button 
                      className={`dropdown-item ${selectedStatus === 'rejected' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('rejected')}
                    >
                      Rejected
                    </button>
                  </div>
                )}
              </div>
              
              {/* Export Dropdown */}
              <div className="table-action-dropdown" ref={exportRef}>
                <button className="table-action-btn" onClick={() => setShowExportMenu(!showExportMenu)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Export
                </button>
                {showExportMenu && (
                  <div className="action-dropdown-menu">
                    <button className="dropdown-item" onClick={() => handleExport('excel')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Export as Excel
                    </button>
                    <button className="dropdown-item" onClick={() => handleExport('pdf')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Export as PDF
                    </button>
                    <button className="dropdown-item" onClick={() => handleExport('csv')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Export as CSV
                    </button>
                  </div>
                )}
              </div>
              
              {/* Month Dropdown */}
              <div className="table-action-dropdown" ref={monthRef}>
                <button className="table-action-btn" onClick={() => setShowMonthMenu(!showMonthMenu)}>
                  {selectedMonth === 'this-month' ? 'This Month' : 
                   selectedMonth === 'last-month' ? 'Last Month' :
                   selectedMonth === 'this-year' ? 'This Year' : 
                   selectedMonth === 'all-time' ? 'All Time' : 'All Time'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showMonthMenu && (
                  <div className="action-dropdown-menu">
                    <button 
                      className={`dropdown-item ${selectedMonth === 'this-month' ? 'active' : ''}`}
                      onClick={() => handleMonthChange('this-month')}
                    >
                      This Month
                    </button>
                    <button 
                      className={`dropdown-item ${selectedMonth === 'last-month' ? 'active' : ''}`}
                      onClick={() => handleMonthChange('last-month')}
                    >
                      Last Month
                    </button>
                    <button 
                      className={`dropdown-item ${selectedMonth === 'this-year' ? 'active' : ''}`}
                      onClick={() => handleMonthChange('this-year')}
                    >
                      This Year
                    </button>
                    <button 
                      className={`dropdown-item ${selectedMonth === 'all-time' ? 'active' : ''}`}
                      onClick={() => handleMonthChange('all-time')}
                    >
                      All Time
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Name</th>
                  <th>Requested Date</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-empty-state">
                      <div className="empty-state-content">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="empty-state-icon">
                          <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="empty-state-title">No requests found</h3>
                        <p className="empty-state-message">
                          {searchTerm || selectedStatus !== 'all' 
                            ? 'Try adjusting your search or filter criteria.' 
                            : 'There are no climb requests at the moment.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-id">{request.requestId || request.id}</td>
                      <td>{request.name || 'N/A'}</td>
                      <td>{request.requestedDate || 'Not specified'}</td>
                      <td>{request.dateSubmitted || 'Not specified'}</td>
                      <td>
                        <span className={`status-badge ${(request.status || 'Pending').toLowerCase()}`}>
                          {request.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="view-details-btn"
                          onClick={() => {
                            console.log('View Details clicked for request:', request.id, request);
                            handleActionClick(request.id, 'view');
                          }}
                          disabled={loadingDetails}
                        >
                          {loadingDetails ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="spinning">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                                </circle>
                              </svg>
                              Loading...
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              View Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="header-content">
                  <div className="header-title-row">
                    <h3>Request Details</h3>
                    <span className="request-id-badge">{selectedRequest.id}</span>
                  </div>
                  <p className="submission-date">Submitted on {selectedRequest.dateSubmitted ? formatBookingDate(selectedRequest._booking?.createdAt || selectedRequest.dateSubmitted, 'long') : 'Not specified'}</p>
                </div>
                <div className="header-right">
                  <span className={`status-badge-modal ${selectedRequest.status.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    {selectedRequest.status.toUpperCase()}
                  </span>
                  <button 
                    className="close-btn"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <form className="request-details-form">
                  {/* Requester Information Section */}
                  <div className="requester-section">
                    <div className="section-title-green">
                      <div className="section-line-green"></div>
                      <h4>Requester Information</h4>
                    </div>
                    
                    {/* Full Name */}
                    <div className="form-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName && formData.fullName.trim() ? formData.fullName : 'Not specified'}
                        readOnly
                        className="form-input form-input-readonly"
                      />
                    </div>

                    {/* Phone Number and Age (Side-by-Side) */}
                    <div className="form-row">
                      <div className="form-field form-field-half">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber && formData.phoneNumber.trim() ? formData.phoneNumber : 'Not specified'}
                          readOnly
                          className="form-input form-input-readonly"
                        />
                      </div>
                      <div className="form-field form-field-half">
                        <label>Age</label>
                        <input
                          type="text"
                          name="age"
                          value={formData.age && formData.age.trim() ? formData.age : 'Not specified'}
                          readOnly
                          className="form-input form-input-readonly"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="form-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email && formData.email.trim() ? formData.email : 'Not specified'}
                        readOnly
                        className="form-input form-input-readonly"
                      />
                    </div>

                    {/* Affiliation and Number of Porters (Side-by-Side) */}
                    <div className="form-row">
                      <div className="form-field form-field-half">
                        <label>Affiliation</label>
                        <input
                          type="text"
                          name="affiliation"
                          value={formData.affiliation && formData.affiliation.trim() ? formData.affiliation : 'Not specified'}
                          readOnly
                          className="form-input form-input-readonly"
                        />
                      </div>
                      <div className="form-field form-field-half">
                        <label>Number of Porters</label>
                        <input
                          type="text"
                          name="numberOfPorters"
                          value={formData.numberOfPorters ? (typeof formData.numberOfPorters === 'string' ? formData.numberOfPorters.trim() : String(formData.numberOfPorters)) : 'Not specified'}
                          readOnly
                          className="form-input form-input-readonly"
                        />
                      </div>
                    </div>

                    {/* Purpose of Climb */}
                    <div className="form-field">
                      <label>Purpose of Climb</label>
                      <input
                        type="text"
                        name="purposeOfClimb"
                        value={formData.purposeOfClimb && formData.purposeOfClimb.trim() ? formData.purposeOfClimb : 'Not specified'}
                        readOnly
                        className="form-input form-input-readonly"
                      />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="documents-section">
                    <div className="section-title-green">
                      <div className="section-line-green"></div>
                      <h4>Documents</h4>
                    </div>
                    {uploadedFiles && uploadedFiles.length > 0 ? (
                      <div className="file-list">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="file-item" onClick={() => handleFileOpen(file)}>
                            <div className="file-icon">
                              {getFileIcon(file.type || file.mimeType || '')}
                            </div>
                            <div className="file-info">
                              <div className="file-name">{file.name || file.fileName || `Document ${index + 1}`}</div>
                              {file.size && (
                                <div className="file-size">
                                  {(file.size / 1024).toFixed(2)} KB
                                </div>
                              )}
                            </div>
                            <div className="file-action">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2"/>
                                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="file-drop-zone">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="document-icon">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <p className="drop-zone-text">No files uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Request Status Update Section */}
                  <div className="status-update-section">
                    <div className="section-title-green">
                      <div className="section-line-green"></div>
                      <h4>Request Status Update</h4>
                    </div>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add your message here..."
                      className="status-update-textarea"
                      rows="4"
                    />
                    <button
                      type="button"
                      className="send-update-btn"
                      onClick={async () => {
                        if (adminNote.trim() && selectedRequest) {
                          try {
                            // Update booking with admin notes
                            const bookingStatus = selectedRequest._booking?.status || selectedRequest.status?.toLowerCase() || 'pending';
                            await updateBookingStatus(selectedRequest.id, bookingStatus, adminNote);
                            alert('Update sent successfully!');
                            // Refresh requests
                            await fetchClimbRequests();
                          } catch (err) {
                            console.error('Error sending update:', err);
                            alert('Failed to send update. Please try again.');
                          }
                        }
                      }}
                      disabled={!adminNote.trim()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Send Update
                    </button>
                  </div>
                </form>
              </div>
              {selectedRequest && (
                <div className="modal-actions">
                  <div className="action-buttons">
                    {(() => {
                      // Check if status is pending - check multiple possible locations
                      const bookingStatus = selectedRequest._booking?.status?.toLowerCase();
                      const displayStatus = selectedRequest.status?.toLowerCase();
                      const status = bookingStatus || displayStatus || '';
                      const isPending = status === 'pending';
                      
                      return (
                        <>
                          <button 
                            className="btn-reject-new"
                            disabled={!isPending}
                            onClick={async () => {
                              if (!isPending) return;
                              try {
                                await handleActionClick(selectedRequest.id, 'reject');
                                setShowDetailsModal(false);
                                await fetchClimbRequests();
                              } catch (err) {
                                console.error('Error rejecting request:', err);
                                alert('Failed to reject request. Please try again.');
                              }
                            }}
                            style={{ opacity: isPending ? 1 : 0.5, cursor: isPending ? 'pointer' : 'not-allowed' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Reject Request
                          </button>
                          <button 
                            className="btn-approve-new"
                            disabled={!isPending}
                            onClick={async () => {
                              if (!isPending) return;
                              try {
                                await handleActionClick(selectedRequest.id, 'approve');
                                setShowDetailsModal(false);
                                await fetchClimbRequests();
                              } catch (err) {
                                console.error('Error approving request:', err);
                                alert('Failed to approve request. Please try again.');
                              }
                            }}
                            style={{ opacity: isPending ? 1 : 0.5, cursor: isPending ? 'pointer' : 'not-allowed' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Approve Request
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default ClimbRequest;


