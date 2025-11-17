import React, { useState, useRef, useEffect } from 'react';
import '../style/ClimbRequest.css';

function ClimbRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('this-month');
  
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

  // Sample data for climb requests
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      name: 'John Smith',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      emergencyContact: 'Jane Smith - +1 (555) 987-6543',
      experience: 'Intermediate',
      groupSize: '2 people',
      specialRequests: 'Vegetarian meals preferred'
    },
    {
      id: 'REQ-002',
      name: 'John Smooth',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.smooth@email.com',
      phone: '+1 (555) 234-5678',
      emergencyContact: 'Mary Smooth - +1 (555) 876-5432',
      experience: 'Beginner',
      groupSize: '1 person',
      specialRequests: 'None'
    },
    {
      id: 'REQ-003',
      name: 'John Sim',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.sim@email.com',
      phone: '+1 (555) 345-6789',
      emergencyContact: 'Bob Sim - +1 (555) 765-4321',
      experience: 'Advanced',
      groupSize: '3 people',
      specialRequests: 'Early morning departure'
    },
    {
      id: 'REQ-004',
      name: 'John Smile',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.smile@email.com',
      phone: '+1 (555) 456-7890',
      emergencyContact: 'Alice Smile - +1 (555) 654-3210',
      experience: 'Intermediate',
      groupSize: '2 people',
      specialRequests: 'Photography equipment'
    },
    {
      id: 'REQ-005',
      name: 'John Shy',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.shy@email.com',
      phone: '+1 (555) 567-8901',
      emergencyContact: 'Tom Shy - +1 (555) 543-2109',
      experience: 'Beginner',
      groupSize: '1 person',
      specialRequests: 'Quiet accommodation'
    },
    {
      id: 'REQ-006',
      name: 'John Shine',
      requestedDate: '6/15/2025',
      dateSubmitted: '5/10/2025',
      status: 'Pending',
      email: 'john.shine@email.com',
      phone: '+1 (555) 678-9012',
      emergencyContact: 'Lisa Shine - +1 (555) 432-1098',
      experience: 'Expert',
      groupSize: '4 people',
      specialRequests: 'Professional guide requested'
    }
  ]);

  const handleActionClick = (requestId, action) => {
    if (action === 'view') {
      const request = requests.find(req => req.id === requestId);
      setSelectedRequest(request);
      // Populate form with request data
      setFormData({
        fullName: request.name || '',
        phoneNumber: request.phone || '',
        age: '',
        email: request.email || '',
        affiliation: '',
        numberOfPorters: '',
        purposeOfClimb: ''
      });
      setUploadedFiles([]);
      setAdminNote('');
      setShowDetailsModal(true);
    } else if (action === 'approve' || action === 'reject' || action === 'pending') {
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Pending' }
            : request
        )
      );
    }
  };

  const handleFileOpen = (file) => {
    if (file.url) {
      window.open(file.url, '_blank');
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

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      request.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="climb-main">
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
                   selectedMonth === 'this-year' ? 'This Year' : 'This Month'}
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
                      <td className="request-id">{request.id}</td>
                      <td>{request.name}</td>
                      <td>{request.requestedDate}</td>
                      <td>{request.dateSubmitted}</td>
                      <td>
                        <span className={`status-badge ${request.status.toLowerCase()}`}>{request.status}</span>
                      </td>
                      <td>
                        <button 
                          className="view-details-btn"
                          onClick={() => handleActionClick(request.id, 'view')}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          View Details
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
                  <p className="submission-date">Submitted on {(() => {
                    const dateParts = selectedRequest.dateSubmitted.split('/');
                    if (dateParts.length === 3) {
                      const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                    return selectedRequest.dateSubmitted;
                  })()}</p>
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
                          value={formData.numberOfPorters && formData.numberOfPorters.trim() ? formData.numberOfPorters : 'Not specified'}
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
                    <div className="file-drop-zone">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="document-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <p className="drop-zone-text">No files uploaded</p>
                      <p className="drop-zone-hint">Click to browse</p>
                    </div>
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
                      onClick={() => {
                        if (adminNote.trim()) {
                          // Handle sending update - you can add API call here
                          console.log('Sending update:', adminNote);
                          // Optionally show success message or clear the textarea
                          // setAdminNote('');
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
              {selectedRequest.status === 'Pending' && (
                <div className="modal-actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-reject-new"
                      onClick={() => {
                        handleActionClick(selectedRequest.id, 'reject');
                        setShowDetailsModal(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Reject Request
                    </button>
                    <button 
                      className="btn-approve-new"
                      onClick={() => {
                        handleActionClick(selectedRequest.id, 'approve');
                        setShowDetailsModal(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Approve Request
                    </button>
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


