import React from 'react';
import { Box } from '@mui/material';
import GanttChart from '../components/gantt/GanttChart';

const GanttView: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <GanttChart />
    </Box>
  );
};

export default GanttView;