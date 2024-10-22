import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface TaskColumnProps {
  title: string;
  children: React.ReactNode;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, children }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default TaskColumn;