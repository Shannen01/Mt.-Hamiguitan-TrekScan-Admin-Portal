import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';

function Dashboard() {
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
      </main>
    </div>
  );
}

export default Dashboard;
