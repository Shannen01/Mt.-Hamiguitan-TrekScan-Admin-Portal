import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../style/Reports.css';

function Reports() {
  const [timeFilter, setTimeFilter] = useState('monthly'); // 'daily', 'weekly', 'monthly', 'custom'
  const [customStartDate, setCustomStartDate] = useState(dayjs().subtract(30, 'day'));
  const [customEndDate, setCustomEndDate] = useState(dayjs());
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Generate sample data based on time filter
  const generateTrekkerActivity = useCallback(() => {
    const days = [];
    const values = [];
    let startDate, endDate, interval;

    switch (timeFilter) {
      case 'daily':
        // Last 7 days
        startDate = dayjs().subtract(6, 'day');
        endDate = dayjs();
        interval = 'day';
        break;
      case 'weekly':
        // Last 7 weeks
        startDate = dayjs().subtract(6, 'week');
        endDate = dayjs();
        interval = 'week';
        break;
      case 'monthly':
        // Last 12 months
        startDate = dayjs().subtract(11, 'month');
        endDate = dayjs();
        interval = 'month';
        break;
      case 'custom':
        startDate = customStartDate;
        endDate = customEndDate;
        interval = 'day';
        break;
      default:
        startDate = dayjs().subtract(11, 'month');
        endDate = dayjs();
        interval = 'month';
    }

    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate)) {
      if (interval === 'day') {
        days.push(current.format('MMM D'));
      } else if (interval === 'week') {
        days.push(`Week ${current.week()}`);
      } else {
        days.push(current.format('MMM YYYY'));
      }
      
      // Generate random but realistic values
      const baseValue = interval === 'day' ? 15 : interval === 'week' ? 100 : 400;
      const variation = Math.random() * 0.4 - 0.2; // ±20% variation
      values.push(Math.round(baseValue * (1 + variation)));
      
      current = current.add(1, interval);
    }

    return { days, values };
  }, [timeFilter, customStartDate, customEndDate]);

  const { days, values } = generateTrekkerActivity();

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalTrekkers = values.reduce((sum, val) => sum + val, 0);
    const dailyTrekkers = timeFilter === 'daily' ? values[values.length - 1] : 
                         timeFilter === 'weekly' ? Math.round(totalTrekkers / 7) :
                         timeFilter === 'monthly' ? Math.round(totalTrekkers / 30) : 
                         values[values.length - 1];
    const totalBookings = Math.round(totalTrekkers * 1.1); // Assume 10% more bookings than trekkers
    const totalCancellations = Math.round(totalBookings * 0.08); // 8% cancellation rate
    const dailyCapacity = 30;
    const capacityUsed = Math.round((dailyTrekkers / dailyCapacity) * 100);

    // Calculate average group size
    const avgGroupSize = (totalBookings > 0) ? (totalTrekkers / totalBookings).toFixed(1) : '0';

    // Find peak activity
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    const peakLabel = days[maxIndex];

    // Calculate most popular day
    const dayCounts = {};
    // Sample data for popular days
    const popularDays = ['Saturday', 'Sunday', 'Tuesday'];
    const mostPopularDay = popularDays[Math.floor(Math.random() * popularDays.length)];

    return {
      totalTrekkers,
      dailyTrekkers,
      totalBookings,
      totalCancellations,
      capacityUsed,
      avgGroupSize,
      peakValue: maxValue,
      peakLabel,
      mostPopularDay
    };
  }, [values, days, timeFilter]);

  // Chart dimensions for Trekker Activity Trend
  const chartWidth = 900;
  const chartHeight = 340;
  const padding = { top: 30, right: 24, bottom: 40, left: 44 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;
  const maxY = 40; // Fixed maximum of 40

  const xAt = (i) => padding.left + (i * innerW) / (values.length - 1 || 1);
  const yAt = (v) => padding.top + innerH - (v / maxY) * innerH;

  // Smooth line path
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
  const [hover, setHover] = useState(null);
  const [barHover, setBarHover] = useState(null);

  // Booking vs Cancellation data
  const bookingData = useMemo(() => {
    const bookingValues = values.map(v => Math.round(v * 1.1));
    const cancellationValues = bookingValues.map(v => Math.round(v * 0.08));
    return { bookingValues, cancellationValues };
  }, [values]);

  // Bar chart dimensions
  const barChartWidth = 900;
  const barChartHeight = 300;
  const barPadding = { top: 30, right: 24, bottom: 40, left: 44 };
  const barInnerW = barChartWidth - barPadding.left - barPadding.right;
  const barInnerH = barChartHeight - barPadding.top - barPadding.bottom;
  const barMaxY = Math.max(...bookingData.bookingValues, ...bookingData.cancellationValues, 1) * 1.2;

  const barXAt = (i) => barPadding.left + (i * barInnerW) / (values.length - 1 || 1);
  const barYAt = (v) => barPadding.top + barInnerH - (v / barMaxY) * barInnerH;
  const barWidth = barInnerW / (values.length * 2.5);


  // Prepare export data
  const prepareExportData = useMemo(() => {
    const periodLabel = timeFilter === 'daily' ? 'Daily' : 
                        timeFilter === 'weekly' ? 'Weekly' : 
                        timeFilter === 'monthly' ? 'Monthly' : 
                        `Custom (${customStartDate.format('MMM D, YYYY')} - ${customEndDate.format('MMM D, YYYY')})`;
    
    // Summary metrics
    const summaryData = {
      period: periodLabel,
      totalTrekkers: metrics.totalTrekkers,
      totalBookings: metrics.totalBookings,
      totalCancellations: metrics.totalCancellations,
      capacityUsed: `${metrics.capacityUsed}%`,
      averageGroupSize: metrics.avgGroupSize,
      peakActivity: `${metrics.peakLabel} (${metrics.peakValue} trekkers)`,
      mostPopularDay: metrics.mostPopularDay
    };

    // Trekker activity data (for charts)
    const activityData = days.map((day, index) => ({
      period: day,
      trekkers: values[index]
    }));

    // Booking vs Cancellation data
    const bookingCancellationData = days.map((day, index) => ({
      period: day,
      bookings: bookingData.bookingValues[index],
      cancellations: bookingData.cancellationValues[index],
      netBookings: bookingData.bookingValues[index] - bookingData.cancellationValues[index]
    }));

    return {
      summary: summaryData,
      activity: activityData,
      bookings: bookingCancellationData
    };
  }, [timeFilter, customStartDate, customEndDate, days, values, metrics, bookingData]);

  // Export functions
  const handleExport = (format) => {
    setShowExportMenu(false);
    
    // Show what data would be exported
    const exportData = prepareExportData;
    
    if (format === 'excel') {
      // Excel would contain multiple sheets:
      // Sheet 1: Summary Metrics
      // Sheet 2: Trekker Activity (Date, Trekkers)
      // Sheet 3: Bookings vs Cancellations (Date, Bookings, Cancellations, Net Bookings)
      console.log('Excel Export Data:', {
        'Summary Sheet': exportData.summary,
        'Activity Sheet': exportData.activity,
        'Bookings Sheet': exportData.bookings
      });
      alert(`Excel Export would include:\n\n1. Summary Sheet:\n   - Period: ${exportData.summary.period}\n   - Total Trekkers: ${exportData.summary.totalTrekkers.toLocaleString()}\n   - Total Bookings: ${exportData.summary.totalBookings.toLocaleString()}\n   - Total Cancellations: ${exportData.summary.totalCancellations.toLocaleString()}\n   - Capacity Used: ${exportData.summary.capacityUsed}\n   - Average Group Size: ${exportData.summary.averageGroupSize}\n   - Peak Activity: ${exportData.summary.peakActivity}\n   - Most Popular Day: ${exportData.summary.mostPopularDay}\n\n2. Activity Sheet:\n   - ${exportData.activity.length} rows with Date and Trekkers count\n\n3. Bookings Sheet:\n   - ${exportData.bookings.length} rows with Date, Bookings, Cancellations, and Net Bookings`);
    } else if (format === 'pdf') {
      // PDF would be a formatted report with:
      // - Header with period and export date
      // - Summary metrics section
      // - Charts (as images)
      // - Detailed tables
      console.log('PDF Export Data:', exportData);
      alert(`PDF Export would include:\n\n- Formatted report header with period: ${exportData.summary.period}\n- Summary metrics section\n- Charts (Trekker Activity Trend & Bookings vs Cancellations)\n- Detailed data tables\n- Analytics section (Peak Activity, Most Popular Day, Average Group Size)`);
    } else if (format === 'csv') {
      // CSV would be a single file with all data
      console.log('CSV Export Data:', exportData);
      alert(`CSV Export would include:\n\n- Combined CSV file with:\n  1. Summary row with all metrics\n  2. ${exportData.activity.length} rows of activity data (Date, Trekkers)\n  3. ${exportData.bookings.length} rows of booking data (Date, Bookings, Cancellations, Net Bookings)`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="reports-main">
        {/* Header with Time Filter and Export */}
        <div className="reports-header">
          <div className="time-filter-container">
            <button
              className={`filter-btn ${timeFilter === 'daily' ? 'active' : ''}`}
              onClick={() => setTimeFilter('daily')}
            >
              Daily
            </button>
            <button
              className={`filter-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeFilter('weekly')}
            >
              Weekly
            </button>
            <button
              className={`filter-btn ${timeFilter === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeFilter('monthly')}
            >
              Monthly
            </button>
            <button
              className={`filter-btn ${timeFilter === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setTimeFilter('custom');
                setShowCustomDatePicker(!showCustomDatePicker);
              }}
            >
              Custom Range
            </button>

            {timeFilter === 'custom' && (
              <div className="custom-date-picker">
                <DatePicker
                  label="Start Date"
                  value={customStartDate}
                  onChange={(newValue) => setCustomStartDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="End Date"
                  value={customEndDate}
                  onChange={(newValue) => setCustomEndDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </div>
            )}
          </div>

          <div className="export-container">
            <button
              className="export-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export
            </button>
            {showExportMenu && (
              <div className="export-dropdown">
                <div className="export-option" onClick={() => handleExport('excel')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Export to Excel
                </div>
                <div className="export-option" onClick={() => handleExport('pdf')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Export to PDF
                </div>
                <div className="export-option" onClick={() => handleExport('csv')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Export to CSV
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="reports-metrics-cards">
          <div className="metric-card">
            <div className="metric-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="metric-card-content">
              <div className="metric-card-value">{metrics.totalTrekkers.toLocaleString()}</div>
              <div className="metric-card-label">Total Trekkers</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="metric-card-content">
              <div className="metric-card-value">{metrics.totalBookings.toLocaleString()}</div>
              <div className="metric-card-label">Total Bookings</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="metric-card-content">
              <div className="metric-card-value">{metrics.totalCancellations.toLocaleString()}</div>
              <div className="metric-card-label">Total Cancellations</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="metric-card-content">
              <div className="metric-card-value">{metrics.capacityUsed}%</div>
              <div className="metric-card-label">Capacity Used</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2, mt: 2 }}>
          {/* Trekker Activity Trend */}
          <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
            <div className="chart-gradient-bar"></div>
            <CardContent>
              <div className="chart-header">
                <div className="chart-title-section">
                  <div className="chart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L7 8L12 12L17 7L21 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <Typography variant="h6" component="h2" className="chart-title">
                      Trekker Activity Trend
                    </Typography>
                    <Typography variant="body2" className="chart-subtitle">
                      Number of trekkers over the selected period
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="trek-chart">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Trekker Activity Line Chart">
                  <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="#f9fafb" rx="8" />

                  {/* Grid lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = padding.top + (innerH / 4) * i;
                    const value = Math.round(maxY - (maxY / 4) * i);
                    return (
                      <g key={`grid-${i}`}>
                        <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="#eeeeee" strokeWidth="1" />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="axis-text">{value}</text>
                      </g>
                    );
                  })}

                  {/* X axis labels */}
                  {days.map((d, i) => {
                    if (i % Math.ceil(days.length / 8) === 0 || i === days.length - 1) {
                      return (
                        <text key={`x-${i}`} x={xAt(i)} y={chartHeight - 8} textAnchor="middle" className="axis-text">{d}</text>
                      );
                    }
                    return null;
                  })}

                  {/* Area fill */}
                  <path
                    d={`${pathD} L ${xAt(values.length - 1)} ${chartHeight - padding.bottom} L ${xAt(0)} ${chartHeight - padding.bottom} Z`}
                    fill="#e8f5e9"
                  />

                  {/* Line */}
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
                      onMouseEnter={() => setHover({ x: p.x, y: p.y, v: p.v, label: days[p.i] })}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}

                  {/* Axes */}
                  <line x1={padding.left} x2={padding.left} y1={padding.top} y2={chartHeight - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={padding.left} x2={chartWidth - padding.right} y1={chartHeight - padding.bottom} y2={chartHeight - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                </svg>

                {hover && (
                  <div
                    className="trek-tooltip"
                    style={{ left: hover.x, top: hover.y }}
                  >
                    <div className="trek-tooltip-date">{hover.label}</div>
                    <div className="trek-tooltip-value">{hover.v} trekkers</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking vs Cancellation Chart */}
          <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
            <div className="chart-gradient-bar"></div>
            <CardContent>
              <div className="chart-header">
                <div className="chart-title-section">
                  <div className="chart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                      <path d="M3 9H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 3V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <Typography variant="h6" component="h2" className="chart-title">
                      Bookings vs Cancellations
                    </Typography>
                    <Typography variant="body2" className="chart-subtitle">
                      Comparison of bookings and cancellations
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="trek-chart">
                <svg viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} role="img" aria-label="Booking vs Cancellation Bar Chart">
                  <rect x="0" y="0" width={barChartWidth} height={barChartHeight} fill="#f9fafb" rx="8" />

                  {/* Grid lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = barPadding.top + (barInnerH / 4) * i;
                    const value = Math.round(barMaxY - (barMaxY / 4) * i);
                    return (
                      <g key={`bar-grid-${i}`}>
                        <line x1={barPadding.left} x2={barChartWidth - barPadding.right} y1={y} y2={y} stroke="#eeeeee" strokeWidth="1" />
                        <text x={barPadding.left - 8} y={y + 4} textAnchor="end" className="axis-text">{value}</text>
                      </g>
                    );
                  })}

                  {/* Bars */}
                  {values.map((_, i) => {
                    const bookingHeight = barInnerH - (barYAt(bookingData.bookingValues[i]) - barPadding.top);
                    const cancelHeight = barInnerH - (barYAt(bookingData.cancellationValues[i]) - barPadding.top);
                    const x = barXAt(i) - barWidth / 2;
                    const centerX = barXAt(i);

                    return (
                      <g key={`bars-${i}`}>
                        {/* Booking bar */}
                        <rect
                          x={x}
                          y={barYAt(bookingData.bookingValues[i])}
                          width={barWidth * 0.8}
                          height={bookingHeight}
                          fill="#30622f"
                          rx="2"
                          onMouseEnter={() => setBarHover({ 
                            x: centerX, 
                            y: barYAt(bookingData.bookingValues[i]) - 10,
                            period: days[i],
                            bookings: bookingData.bookingValues[i],
                            cancellations: bookingData.cancellationValues[i]
                          })}
                          onMouseLeave={() => setBarHover(null)}
                          style={{ cursor: 'pointer' }}
                        />
                        {/* Cancellation bar */}
                        <rect
                          x={x + barWidth * 0.8 + 2}
                          y={barYAt(bookingData.cancellationValues[i])}
                          width={barWidth * 0.8}
                          height={cancelHeight}
                          fill="#ef4444"
                          rx="2"
                          onMouseEnter={() => setBarHover({ 
                            x: centerX, 
                            y: barYAt(bookingData.cancellationValues[i]) - 10,
                            period: days[i],
                            bookings: bookingData.bookingValues[i],
                            cancellations: bookingData.cancellationValues[i]
                          })}
                          onMouseLeave={() => setBarHover(null)}
                          style={{ cursor: 'pointer' }}
                        />
                      </g>
                    );
                  })}

                  {/* X axis labels */}
                  {days.map((d, i) => {
                    if (i % Math.ceil(days.length / 8) === 0 || i === days.length - 1) {
                      return (
                        <text key={`bar-x-${i}`} x={barXAt(i)} y={barChartHeight - 8} textAnchor="middle" className="axis-text">{d}</text>
                      );
                    }
                    return null;
                  })}

                  {/* Legend */}
                  <g>
                    <rect x={barChartWidth - 120} y={20} width="12" height="12" fill="#30622f" rx="2" />
                    <text x={barChartWidth - 100} y={30} className="axis-text" fontSize="12">Bookings</text>
                    <rect x={barChartWidth - 120} y={38} width="12" height="12" fill="#ef4444" rx="2" />
                    <text x={barChartWidth - 100} y={48} className="axis-text" fontSize="12">Cancellations</text>
                  </g>

                  {/* Axes */}
                  <line x1={barPadding.left} x2={barPadding.left} y1={barPadding.top} y2={barChartHeight - barPadding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={barPadding.left} x2={barChartWidth - barPadding.right} y1={barChartHeight - barPadding.bottom} y2={barChartHeight - barPadding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                </svg>

                {barHover && (
                  <div
                    className="bar-chart-tooltip"
                    style={{ 
                      left: `${(barHover.x / barChartWidth) * 100}%`,
                      top: `${(barHover.y / barChartHeight) * 100}%`
                    }}
                  >
                    <div className="bar-tooltip-period">{barHover.period}</div>
                    <div className="bar-tooltip-bookings">bookings : {barHover.bookings}</div>
                    <div className="bar-tooltip-cancellations">cancellations : {barHover.cancellations}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Box>

        {/* Additional Analytics */}
        <div className="analytics-cards">
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ padding: '24px !important' }}>
              <div className="analytics-card-header">
                <Typography variant="h6" component="h2" className="analytics-card-title">
                  Peak Activity
                </Typography>
              </div>
              <div className="analytics-card-body">
                <div className="analytics-stat-item">
                  <span className="analytics-stat-label">Period:</span>
                  <span className="analytics-stat-value">{metrics.peakLabel}</span>
                </div>
                <div className="analytics-stat-item">
                  <span className="analytics-stat-label">Trekkers:</span>
                  <span className="analytics-stat-value">{metrics.peakValue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ padding: '24px !important' }}>
              <div className="analytics-card-header">
                <Typography variant="h6" component="h2" className="analytics-card-title">
                  Most Popular Day
                </Typography>
              </div>
              <div className="analytics-card-body">
                <div className="popular-day-chart">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const fullDayName = dayNames[index];
                    const isPopular = metrics.mostPopularDay.toLowerCase().includes(day.toLowerCase()) || 
                                     metrics.mostPopularDay.toLowerCase().includes(fullDayName.toLowerCase());
                    const height = isPopular ? 100 : (index % 3 === 0 ? 60 : index % 3 === 1 ? 40 : 30);
                    
                    // Progressive color gradient from light to vibrant green
                    const colors = [
                      { light: '#e8f5e9', dark: '#c8e6c9' }, // Very light green
                      { light: '#c8e6c9', dark: '#a5d6a7' }, // Light green
                      { light: '#a5d6a7', dark: '#81c784' }, // Medium light green
                      { light: '#81c784', dark: '#66bb6a' }, // Medium green
                      { light: '#66bb6a', dark: '#4caf50' }, // Medium-dark green
                      { light: '#4caf50', dark: '#30622f' }, // Dark green
                      { light: '#30622f', dark: '#30622f' }  // Vibrant green
                    ];
                    const colorSet = colors[index] || colors[colors.length - 1];
                    
                    return (
                      <div key={day} className="popular-day-bar-container">
                        <div 
                          className="popular-day-bar"
                          style={{ 
                            height: `${height}%`,
                            background: `linear-gradient(to top, ${colorSet.light}, ${colorSet.dark})`
                          }}
                        />
                        <span className="popular-day-label">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="analytics-average">
                  Average: {metrics.mostPopularDay}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ padding: '24px !important' }}>
              <div className="analytics-card-header">
                <Typography variant="h6" component="h2" className="analytics-card-title">
                  Average Group Size
                </Typography>
              </div>
              <div className="analytics-card-body">
                <div className="analytics-stat-item">
                  <span className="analytics-stat-label">Average:</span>
                  <span className="analytics-stat-value">{metrics.avgGroupSize}</span>
                </div>
                <div className="analytics-stat-item">
                  <span className="analytics-stat-label">Total Bookings:</span>
                  <span className="analytics-stat-value">{metrics.totalBookings.toLocaleString()}</span>
                </div>
                <div className="analytics-stat-item">
                  <span className="analytics-stat-label">Total Trekkers:</span>
                  <span className="analytics-stat-value">{metrics.totalTrekkers.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </LocalizationProvider>
  );
}

export default Reports;
