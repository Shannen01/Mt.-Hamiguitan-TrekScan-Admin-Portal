import React, { useState } from 'react';
import '../style/ClimbRequest.css';

function ClimbRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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
    setActiveDropdown(null);
  };

  const toggleDropdown = (requestId) => {
    setActiveDropdown(activeDropdown === requestId ? null : requestId);
  };

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <main className="climb-main">
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
                  <tr key={request.id} className={index === 0 ? 'highlighted-row' : ''}>
                    <td className="request-id">{request.id}</td>
                    <td>{request.name}</td>
                    <td>{request.requestedDate}</td>
                    <td>{request.dateSubmitted}</td>
                    <td>
                      <span className={`status-badge ${request.status.toLowerCase()}`}>{request.status}</span>
                    </td>
                    <td>
                      <div className="actions-container">
                        <button 
                          className="actions-btn"
                          onClick={() => toggleDropdown(request.id)}
                        >
                          <div className="three-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </button>
                        {activeDropdown === request.id && (
                          <div className="actions-dropdown">
                            <button 
                              className="dropdown-item"
                              onClick={() => handleActionClick(request.id, 'view')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              View Details
                            </button>
                            <button 
                              className="dropdown-item approve"
                              onClick={() => handleActionClick(request.id, 'approve')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Approve
                            </button>
                            <button 
                              className="dropdown-item pending"
                              onClick={() => handleActionClick(request.id, 'pending')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Pending
                            </button>
                            <button 
                              className="dropdown-item reject"
                              onClick={() => handleActionClick(request.id, 'reject')}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
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
                  <h3>Request Details</h3>
                  <div className="header-badges">
                    <span className="request-id-badge">{selectedRequest.id}</span>
                    <span className={`status-badge ${selectedRequest.status.toLowerCase()}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                {/* Requester Information Section */}
                <div className="details-section">
                  <div className="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h4>Requester Information</h4>
                  </div>
                  <div className="info-grid">
                    <div className="info-card">
                      <label>FULL NAME</label>
                      <span>{selectedRequest.name}</span>
                    </div>
                    <div className="info-card">
                      <label>EMAIL</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {selectedRequest.email}
                      </span>
                    </div>
                    <div className="info-card">
                      <label>PHONE</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {selectedRequest.phone}
                      </span>
                    </div>
                    <div className="info-card">
                      <label>MEMBER SINCE</label>
                      <span>January 2024</span>
                    </div>
                  </div>
                </div>

                {/* Climb Details Section */}
                <div className="details-section">
                  <div className="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 20h18l-9-16L3 20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h4>Climb Details</h4>
                  </div>
                  <div className="info-grid">
                    <div className="info-card">
                      <label>REQUESTED DATE</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {selectedRequest.requestedDate}
                      </span>
                    </div>
                    <div className="info-card">
                      <label>DATE SUBMITTED</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {selectedRequest.dateSubmitted}
                      </span>
                    </div>
                    <div className="info-card full-width">
                      <label>LOCATION</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Mount Rainier, Washington
                      </span>
                    </div>
                    <div className="info-card full-width">
                      <label>ROUTE</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M3 20h18l-9-16L3 20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Disappointment Cleaver Route
                      </span>
                    </div>
                    <div className="info-card">
                      <label>GROUP SIZE</label>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {selectedRequest.groupSize}
                      </span>
                    </div>
                    <div className="info-card">
                      <label>EXPERIENCE</label>
                      <span className="experience-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {selectedRequest.experience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Notes Section */}
                <div className="details-section">
                  <h4>ADDITIONAL NOTES</h4>
                  <div className="notes-content">
                    {selectedRequest.specialRequests}
                  </div>
                </div>
              </div>
              {selectedRequest.status === 'Pending' && (
                <div className="modal-actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-approve"
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
                    <button 
                      className="btn-reject"
                      onClick={() => {
                        handleActionClick(selectedRequest.id, 'reject');
                        setShowDetailsModal(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Reject Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClimbRequest;


