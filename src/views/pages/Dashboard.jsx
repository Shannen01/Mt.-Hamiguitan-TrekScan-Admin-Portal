import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';

function Dashboard() {
  // Generate dates from Sep 11 to Oct 10 with realistic trekking groups
  const generateTrekActivity = React.useCallback(() => {
    const days = [];
    const values = [];
    
    // Generate dates from Sep 11 to Oct 10
    const startDate = new Date(2024, 8, 11); // Sep 11, 2024 (month 8 = September)
    const endDate = new Date(2024, 9, 10);   // Oct 10, 2024 (month 9 = October)
    
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
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <StatsCard
            title="Active Climbs Today"
            value={24}
            subtitle={'+12% higher from yesterday'}
          />
          <StatsCard
            title="Approved vs Pending"
            value={'18/7'}
            subtitle={'72% approved 28% pending'}
            progress={72}
          />
        </Box>
        
        {/* Main dashboard content - two column layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
          {/* Left: Trek Activity Chart */}
          <Card elevation={2} className="trek-activity-card" sx={{ borderRadius: 2 }}>
            <CardContent>
              <div className="trek-activity-header">
                <div className="trek-activity-title-row">
                  <Typography variant="h6" component="h2" className="trek-activity-title">
                    Trekk Activity
                  </Typography>
                  <span className="percent-badge">+12%</span>
                </div>
                <div className="trek-activity-stats">
                  <Typography variant="h3" component="div" className="trek-activity-number">
                    {totalActiveTrekkers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="trek-activity-subtitle">
                    Number of Active Trekk over the past 30 days.
                  </Typography>
                </div>
              </div>
              
              <div className="trek-chart">
                <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trek Activity Line Chart">
                  <defs>
                    <clipPath id="clip-over">
                      <rect x="0" y="0" width={width} height={capacityY} />
                    </clipPath>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Background */}
                  <rect x="0" y="0" width={width} height={height} fill="#ffffff" />

                  {/* Grid lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = padding.top + (innerH / 4) * i;
                    const value = maxY - (maxY / 4) * i;
                    return (
                      <g key={`grid-${i}`}> 
                        <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="axis-text">{Math.round(value)}</text>
                      </g>
                    );
                  })}

                  {/* X axis labels every 2 days to match the image */}
                  {days.map((d, i) => (i % 2 === 0 ? (
                    <text key={`x-${i}`} x={xAt(i)} y={height - 8} textAnchor="middle" className="axis-text">{d}</text>
                  ) : null))}

                  {/* Capacity line */}
                  <line x1={padding.left} x2={width - padding.right} y1={capacityY} y2={capacityY} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="2" />
                  <text x={width - padding.right - 4} y={capacityY - 4} textAnchor="end" className="capacity-label">Maximum Capacity</text>

                  {/* Area fill */}
                  <path d={`${pathD} L ${xAt(values.length - 1)} ${height - padding.bottom} L ${xAt(0)} ${height - padding.bottom} Z`} fill="url(#areaGrad)" />
                  
                  {/* Green line for values <= 30 */}
                  <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  
                  {/* Red overlay for values > 30 */}
                  <g clipPath="url(#clip-over)">
                    <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  </g>

                  {/* Data points */}
                  {points.map(p => (
                    <circle
                      key={`pt-${p.i}`}
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      fill={p.v > capacity ? "#ef4444" : "#22c55e"}
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
            </CardContent>
          </Card>

          {/* Right: Today's Trekkers */}
          <Card elevation={2} className="todays-trekkers-card" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h2" className="todays-trekkers-title">
                Today's Trekkers
              </Typography>
              <Typography variant="body2" className="todays-trekkers-subtitle">
                Trekkers date of climb today
              </Typography>
              
              <div className="trekkers-dropdown">
                <select className="trekkers-select">
                  <option value="">Trekkers' Name</option>
                  <option value="juan-dela-cruz">Juan Dela Cruz</option>
                  <option value="juan-tom-od">Juan Tom-od</option>
                  <option value="wa-ethil">Wa Ethil</option>
                </select>
              </div>
              
              <div className="trekkers-list">
                <div className="trekker-item">
                  <span className="trekker-number">1.</span>
                  <span className="trekker-name">Juan Dela Cruz</span>
                </div>
                <div className="trekker-item">
                  <span className="trekker-number">2.</span>
                  <span className="trekker-name">Juan Tom-od</span>
                </div>
                <div className="trekker-item">
                  <span className="trekker-number">3.</span>
                  <span className="trekker-name">Wa Ethil</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Box>

        {/* Upcoming Climbs Card */}
        <Card elevation={2} className="upcoming-climbs-card" sx={{ borderRadius: 2, mt: 3 }}>
          <CardContent>
            <div className="upcoming-climbs-header">
              <div className="upcoming-climbs-title-section">
                <Typography variant="h6" component="h2" className="upcoming-climbs-title">
                  Upcoming Climbs
                </Typography>
                <Typography variant="body2" className="upcoming-climbs-subtitle">
                  Climbs scheduled for the next 7 days
                </Typography>
              </div>
              <button className="view-all-btn">VIEW ALL</button>
            </div>
            
            <div className="climbs-tabs">
              <button className="tab-btn active">UPCOMING CLIMBS</button>
              <button className="tab-btn">RECENT APPROVALS</button>
            </div>
            
            <div className="climbs-table">
              <div className="table-header">
                <div className="table-cell">Date</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Status</div>
              </div>
              <div className="table-row">
                <div className="table-cell">May 25 2025</div>
                <div className="table-cell">Juan Dela Cruz</div>
                <div className="table-cell">
                  <span className="status-badge confirmed">Confirmed</span>
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">May 26 2025</div>
                <div className="table-cell">Juan Tom-od</div>
                <div className="table-cell">
                  <span className="status-badge confirmed">Confirmed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
