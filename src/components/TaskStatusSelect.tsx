import React from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { ChevronDown } from 'lucide-react';

interface TaskStatusSelectProps {
  status: string;
  onChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return '#9e9e9e';
    case 'in_progress':
      return '#2196f3';
    case 'completed':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};

export default function TaskStatusSelect({ status, onChange }: TaskStatusSelectProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: string) => {
    onChange(newStatus);
    handleClose();
  };

  const currentStatus = statusOptions.find((option) => option.value === status);

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<ChevronDown size={16} />}
        sx={{
          color: 'white',
          backgroundColor: getStatusColor(status),
          '&:hover': {
            backgroundColor: getStatusColor(status),
            opacity: 0.9,
          },
        }}
        size="small"
      >
        {currentStatus?.label || 'Set Status'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            selected={option.value === status}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}