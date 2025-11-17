import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';

function Dashboard({ onNavigate }) {
  // Generate dates from Oct 1 to Oct 30 with realistic trekking groups
  const generateTrekActivity = React.useCallback(() => {
    const days = [];
    const values = [];
    
    // Generate dates from Oct 1 to Oct 30
    const startDate = new Date(2024, 9, 1); // Oct 1, 2024 (month 9 = October)
    const endDate = new Date(2024, 9, 30);   // Oct 30, 2024 (month 9 = October)
    
    // Define trekking groups: each group starts every 3 days and lasts 3 days
    const groups = [
      { startDay: 0, size: 8 },   // Sep 11-13: 8 trekkers
      { startDay: 3, size: 12 },  // Sep 14-16: 12 trekkers  
      { startDay: 6, size: 6 },   // Sep 17-19: 6 trekkers
      { startDay: 9, size: 15 },  // Sep 20-22: 15 trekkers
      { startDay: 12, size: 10 }, // Sep 23-25: 10 trekkers
      { startDay: 15, size: 18 }, // Sep 26-28: 18 trekkers
      { startDay: 18, size: 7 },  // Sep 29-Oct 1: 7 trekkers
      { startDay: 21, size: 14 }, // Oct 2-4: 14 trekkers
      { startDay: 24, size: 9 },  // Oct 5-7: 9 trekkers
      { startDay: 27, size: 11 }, // Oct 8-10: 11 trekkers
    ];
    
    for (let d = new Date(startDate), dayIndex = 0; d <= endDate; d.setDate(d.getDate() + 1), dayIndex++) {
      const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      days.push(label);
      
      // Calculate total active trekkers for this day
      let totalTrekkers = 0;
      groups.forEach(group => {
        // Check if this group is active on this day (starts on startDay, lasts 3 days)
        if (dayIndex >= group.startDay && dayIndex < group.startDay + 3) {
          totalTrekkers += group.size;
        }
      });
      
      // Cap at 40 for display purposes
      const value = Math.min(40, totalTrekkers);
      values.push(value);
    }
    return { days, values };
  }, []);

  const { days, values } = generateTrekActivity();
  
  // Calculate accurate total of active trekkers from the chart data
  const totalActiveTrekkers = values.reduce((sum, value) => sum + value, 0);

  // Chart dimensions
  const width = 900; // responsive via viewBox
  const height = 340;
  const padding = { top: 30, right: 24, bottom: 40, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxY = 40;
  const capacity = 30;

  const xAt = (i) => padding.left + (i * innerW) / (values.length - 1);
  const yAt = (v) => padding.top + innerH - (v / maxY) * innerH;

  // Smooth line using Catmull-Rom to cubic Bezier conversion
  const toPath = (pts) => {
    if (pts.length < 2) return '';
    const d = [];
    d.push(`M ${pts[0].x} ${pts[0].y}`);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const tension = 0.2;
      const c1x = p1.x + (p2.x - p0.x) * tension;
      const c1y = p1.y + (p2.y - p0.y) * tension;
      const c2x = p2.x - (p3.x - p1.x) * tension;
      const c2y = p2.y - (p3.y - p1.y) * tension;
      d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    }
    return d.join(' ');
  };

  const points = values.map((v, i) => ({ x: xAt(i), y: yAt(v), v, i }));
  const pathD = toPath(points);
  const capacityY = yAt(capacity);

  const [hover, setHover] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('upcoming'); // 'upcoming' or 'recent'
  const [trekkerSearch, setTrekkerSearch] = React.useState('');
  const [showAllTrekkersModal, setShowAllTrekkersModal] = React.useState(false);

  // Data for upcoming climbs
  const upcomingClimbs = [
    { date: 'May 25 2025', name: 'Juan Dela Cruz', status: 'confirmed' },
    { date: 'May 26 2025', name: 'Juan Tom-od', status: 'confirmed' },
    { date: 'May 27 2025', name: 'Maria Santos', status: 'confirmed' },
    { date: 'May 28 2025', name: 'Pedro Rodriguez', status: 'cancelled' },
    { date: 'May 29 2025', name: 'Ana Garcia', status: 'confirmed' },
    { date: 'May 30 2025', name: 'Carlos Mendoza', status: 'pending' },
    { date: 'May 31 2025', name: 'Isabella Reyes', status: 'confirmed' },
  ];

  // Data for recent approvals
  const recentApprovals = [
    { date: 'May 23 2025', name: 'Maria Santos', status: 'approved' },
    { date: 'May 22 2025', name: 'Pedro Rodriguez', status: 'approved' },
    { date: 'May 21 2025', name: 'Ana Garcia', status: 'approved' },
    { date: 'May 20 2025', name: 'Carlos Lopez', status: 'approved' },
  ];

  const StatsCard = ({ title, value, subtitle, progress }) => (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mt: 1, color: progress ? 'text.secondary' : 'success.main' }}>
            {subtitle}
          </Typography>
        )}
        {typeof progress === 'number' && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 9999,
                backgroundColor: '#edf2f7',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#3a451e'
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div style={{ paddingTop: '24px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '300px' }}>
        {/* Stats Cards Section */}
        <div className="dashboard-stats-cards">
          <div className="stat-card">
            <div className="stat-card-icon-square">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 20L12 4L21 20H3Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-card-growth-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +12%
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">24</div>
              <div className="stat-card-label">Active Climbs</div>
            </div>
            <div className="stat-card-accent-line"></div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-icon-square">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-card-growth-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +72%
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">18/7</div>
              <div className="stat-card-label">Approved vs. Pending</div>
            </div>
            <div className="stat-card-accent-line"></div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-icon-square">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-card-growth-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +15.3%
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">1,247</div>
              <div className="stat-card-label">Monthly Bookings</div>
            </div>
            <div className="stat-card-accent-line"></div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-icon-square">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="6" y="12" width="3" height="6" fill="currentColor"/>
                <rect x="11" y="9" width="3" height="9" fill="currentColor"/>
                <rect x="16" y="6" width="3" height="12" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-card-growth-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +8.5%
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">30</div>
              <div className="stat-card-label">Peak Capacity</div>
            </div>
            <div className="stat-card-accent-line"></div>
          </div>
        </div>
        
        {/* Main dashboard content - two column layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
          {/* Left: Trek Activity Chart */}
          <Card elevation={2} className="trek-activity-card" sx={{ borderRadius: 2 }}>
            <div className="trek-activity-gradient-bar"></div>
            <CardContent>
              <div className="trek-activity-header">
                <div className="trek-activity-title-section">
                  <div className="trek-activity-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12L7 8L12 12L17 7L21 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 20L7 16L12 20L17 15L21 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="trek-activity-title-content">
                    <Typography variant="h6" component="h2" className="trek-activity-title">
                      Trekk Activity
                    </Typography>
                    <Typography variant="body2" className="trek-activity-subtitle">
                      Number of Active Trekk over the past 30 days.
                    </Typography>
                  </div>
                </div>
                <span className="percent-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12L7 8L12 12L17 7L21 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +12%
                </span>
              </div>
              
              <div className="trek-activity-total">
                <Typography variant="h2" component="div" className="trek-activity-number">
                  330
                </Typography>
                <Typography variant="body2" className="trek-activity-total-label">
                  total treks
                </Typography>
              </div>
              
              <div className="trek-chart">
                <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trek Activity Line Chart">
                  <defs>
                    <clipPath id="clip-over">
                      <rect x="0" y="0" width={width} height={capacityY} />
                    </clipPath>
                  </defs>
                  
                  {/* Background */}
                  <rect x="0" y="0" width={width} height={height} fill="#f9fafb" rx="8" />

                  {/* Grid lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = padding.top + (innerH / 4) * i;
                    const value = maxY - (maxY / 4) * i;
                    return (
                      <g key={`grid-${i}`}> 
                        <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#eeeeee" strokeWidth="1" />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="axis-text">{Math.round(value)}</text>
                      </g>
                    );
                  })}
                  
                  {/* Vertical grid lines for dates */}
                  {days.map((d, i) => (i % 2 === 0 ? (
                    <line key={`vgrid-${i}`} x1={xAt(i)} x2={xAt(i)} y1={padding.top} y2={height - padding.bottom} stroke="#eeeeee" strokeWidth="1" />
                  ) : null))}

                  {/* X axis labels every 2 days to match the image */}
                  {days.map((d, i) => (i % 2 === 0 ? (
                    <text key={`x-${i}`} x={xAt(i)} y={height - 8} textAnchor="middle" className="axis-text">{d}</text>
                  ) : null))}

                  {/* Capacity line */}
                  <line x1={padding.left} x2={width - padding.right} y1={capacityY} y2={capacityY} stroke="#ff9800" strokeDasharray="4 4" strokeWidth="2" />
                  <text x={width - padding.right - 4} y={capacityY - 4} textAnchor="end" className="capacity-label">Maxi</text>

                  {/* Area fill */}
                  <path d={`${pathD} L ${xAt(values.length - 1)} ${height - padding.bottom} L ${xAt(0)} ${height - padding.bottom} Z`} fill="#e8f5e9" />
                  
                  {/* Green line */}
                  <path d={pathD} fill="none" stroke="#30622f" strokeWidth="2.5" />
                  
                  {/* Data points */}
                  {points.map(p => (
                    <circle
                      key={`pt-${p.i}`}
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill="#30622f"
                      stroke="#ffffff"
                      strokeWidth="2"
                      onMouseEnter={(e) => setHover({ x: p.x, y: p.y, v: p.v, label: days[p.i], isOverCapacity: p.v > capacity })}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}

                  {/* Axes */}
                  <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                </svg>

                {hover && (
                  <div
                    className="trek-tooltip"
                    style={{ left: hover.x, top: hover.y }}
                  >
                    <div className="trek-tooltip-date">{hover.label}</div>
                    <div className="trek-tooltip-value">{hover.v} trekkers</div>
                    {hover.isOverCapacity && (
                      <div className="trek-tooltip-warning">• Above capacity</div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="trek-activity-summary-cards">
                <div className="summary-card peak-activity">
                  <div className="summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 20L12 4L21 20H3Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="summary-card-content">
                    <div className="summary-card-title">Peak Activity</div>
                    <div className="summary-card-value">20</div>
                    <div className="summary-card-date">Sep 29, 2024</div>
                  </div>
                </div>
                
                <div className="summary-card average-daily">
                  <div className="summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="summary-card-content">
                    <div className="summary-card-title">Average Daily</div>
                    <div className="summary-card-value">11.3</div>
                    <div className="summary-card-subtitle">trekkers per day</div>
                  </div>
                </div>
                
                <div className="summary-card capacity-used">
                  <div className="summary-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="summary-card-content">
                    <div className="summary-card-title">Capacity Used</div>
                    <div className="summary-card-value">67%</div>
                    <div className="summary-card-subtitle">of maximum capacity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Today's Trekkers */}
          <Card elevation={2} className="todays-trekkers-card" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <div className="trekkers-header">
              <div className="trekkers-header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trekkers-header-content">
                <Typography variant="h6" component="h2" className="trekkers-header-title">
                  Today's Trekkers
                </Typography>
                <div className="trekkers-header-subtitle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Trekkers scheduled for today</span>
                </div>
              </div>
            </div>
            
            <CardContent sx={{ padding: '16px !important' }}>
              <div className="trekkers-search">
                <input
                  type="text"
                  className="trekkers-search-input"
                  placeholder="Search trekkers..."
                  value={trekkerSearch}
                  onChange={(e) => setTrekkerSearch(e.target.value)}
                />
                <svg className="trekkers-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="trekkers-list">
                {[
                  { id: 'juan-dela-cruz', name: 'Juan Dela Cruz', time: '6:00 AM', status: 'confirmed', number: 1 },
                  { id: 'juan-tom-od', name: 'Juan Tom-od', time: '6:00 AM', status: 'confirmed', number: 2 },
                  { id: 'wa-ethil', name: 'Wa Ethil', time: '7:00 AM', status: 'pending', number: 3 },
                  { id: 'maria-santos', name: 'Maria Santos', time: '6:00 AM', status: 'confirmed', number: 4 },
                  { id: 'pedro-rodriguez', name: 'Pedro Rodriguez', time: '8:00 AM', status: 'confirmed', number: 5 }
                ]
                  .filter(trekker => 
                    !trekkerSearch || 
                    trekker.name.toLowerCase().includes(trekkerSearch.toLowerCase())
                  )
                  .map((trekker) => (
                  <div key={trekker.id} className="trekker-item">
                    <div className="trekker-badge">{trekker.number}</div>
                    <div className="trekker-info">
                      <div className="trekker-name">{trekker.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="view-all-trekkers-btn" onClick={() => setShowAllTrekkersModal(true)}>
                View All 5 More Trekkers
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="trekkers-footer">
                <span className="trekkers-footer-label">Total Trekkers Today:</span>
                <span className="trekkers-footer-count">10</span>
              </div>
            </CardContent>
          </Card>
        </Box>

        {/* Upcoming Climbs Card */}
        <Card elevation={2} className="upcoming-climbs-card" sx={{ borderRadius: 2, mt: 3 }}>
          <CardContent>
            <div className="upcoming-climbs-header">
              <div className="upcoming-climbs-title-section">
                <div className="upcoming-climbs-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20L12 4L21 20H3Z" fill="white"/>
                    <path d="M8 20L12 12L16 20H8Z" fill="white" opacity="0.8"/>
                  </svg>
                </div>
                <div className="upcoming-climbs-title-content">
                  <Typography variant="h6" component="h2" className="upcoming-climbs-title">
                    Upcoming Climbs
                  </Typography>
                  <Typography variant="body2" className="upcoming-climbs-subtitle">
                    Climbs scheduled for the next 7 days
                  </Typography>
                </div>
              </div>
              <button className="view-all-btn" onClick={() => onNavigate && onNavigate('climb')}>VIEW ALL</button>
            </div>
            
            <div className="climbs-tabs">
              <button 
                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                UPCOMING CLIMBS
              </button>
              <button 
                className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTab('recent')}
              >
                RECENT APPROVALS
              </button>
            </div>
            
            <div className="climbs-table">
              <div className="table-header">
                <div className="table-cell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Date
                </div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Status</div>
              </div>
              {activeTab === 'upcoming' ? (
                upcomingClimbs.map((climb, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">{climb.date}</div>
                    <div className="table-cell">{climb.name}</div>
                    <div className="table-cell">
                      <span className={`status-badge ${climb.status}`}>
                        {climb.status === 'confirmed' ? 'Confirmed' : 
                         climb.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                recentApprovals.map((approval, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">{approval.date}</div>
                    <div className="table-cell">{approval.name}</div>
                    <div className="table-cell">
                      <span className="status-badge approved">Approved</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Trekkers Modal */}
        {showAllTrekkersModal && (
          <div className="trekkers-modal-backdrop" onClick={() => setShowAllTrekkersModal(false)}>
            <div className="trekkers-modal" onClick={(e) => e.stopPropagation()}>
              <div className="trekkers-modal-header">
                <h2>All Trekkers Today</h2>
                <button 
                  className="trekkers-modal-close"
                  onClick={() => setShowAllTrekkersModal(false)}
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="trekkers-modal-content">
                <div className="trekkers-modal-search">
                  <input
                    type="text"
                    className="trekkers-modal-search-input"
                    placeholder="Search trekkers..."
                    value={trekkerSearch}
                    onChange={(e) => setTrekkerSearch(e.target.value)}
                  />
                  <svg className="trekkers-modal-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="trekkers-modal-list">
                  {[
                    { id: 'juan-dela-cruz', name: 'Juan Dela Cruz', time: '6:00 AM', status: 'confirmed', number: 1 },
                    { id: 'juan-tom-od', name: 'Juan Tom-od', time: '6:00 AM', status: 'confirmed', number: 2 },
                    { id: 'wa-ethil', name: 'Wa Ethil', time: '7:00 AM', status: 'pending', number: 3 },
                    { id: 'maria-santos', name: 'Maria Santos', time: '6:00 AM', status: 'confirmed', number: 4 },
                    { id: 'pedro-rodriguez', name: 'Pedro Rodriguez', time: '8:00 AM', status: 'confirmed', number: 5 },
                    { id: 'ana-garcia', name: 'Ana Garcia', time: '9:00 AM', status: 'confirmed', number: 6 },
                    { id: 'carlos-lopez', name: 'Carlos Lopez', time: '7:30 AM', status: 'pending', number: 7 },
                    { id: 'lisa-martinez', name: 'Lisa Martinez', time: '8:30 AM', status: 'confirmed', number: 8 },
                    { id: 'james-wilson', name: 'James Wilson', time: '9:30 AM', status: 'confirmed', number: 9 },
                    { id: 'sarah-brown', name: 'Sarah Brown', time: '10:00 AM', status: 'confirmed', number: 10 }
                  ]
                    .filter(trekker => 
                      !trekkerSearch || 
                      trekker.name.toLowerCase().includes(trekkerSearch.toLowerCase())
                    )
                    .map((trekker) => (
                      <div key={trekker.id} className="trekker-modal-item">
                        <div className="trekker-badge">{trekker.number}</div>
                        <div className="trekker-info">
                          <div className="trekker-name">{trekker.name}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="trekkers-modal-footer">
                <span className="trekkers-footer-label">Total Trekkers Today:</span>
                <span className="trekkers-footer-count">10</span>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default Dashboard;
