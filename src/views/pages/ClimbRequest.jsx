import React, { useState } from 'react';
import '../style/ClimbRequest.css';

function ClimbRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
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

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header Section */}
      <div className="climb-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Climb Request</h1>
              <p className="header-subtitle">Review and manage climb requests from users</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="export-container">
                <button 
                  className="export-btn"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15L12 3M12 15L8 11M12 15L16 11M2 17L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showExportMenu && (
                  <div className="export-dropdown">
                    <button 
                      className="export-option"
                      onClick={() => {
                        console.log('Exporting to PDF...');
                        setShowExportMenu(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Export as PDF
                    </button>
                    <button 
                      className="export-option"
                      onClick={() => {
                        console.log('Exporting to Excel...');
                        setShowExportMenu(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Request Management Card */}
        <div className="request-management-card">
          <div className="card-header">
            <h2>Request Management</h2>
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
                {filteredRequests.map((request, index) => (
                  <tr key={request.id} className={index % 2 === 0 ? 'highlighted-row' : ''}>
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
                ))}
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
                    <div className="section-title-blue">
                      <div className="section-line-blue"></div>
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
                    <div className="section-title-blue">
                      <div className="section-line-blue"></div>
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
    </>
  );
}

export default ClimbRequest;


