import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { Edit2 } from 'lucide-react';
import { Task } from '../types';
import TaskStatusSelect from './TaskStatusSelect';
import DOMPurify from 'dompurify';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit }) => {
  const renderDescription = (html: string | undefined) => {
    if (!html) return null;
    
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });

    return (
      <Typography
        variant="body2"
        component="div"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        sx={{
          mb: 2,
          '& p': { margin: 0 },
          '& ul, & ol': { marginTop: 0.5, marginBottom: 0.5, paddingLeft: 2 },
        }}
      />
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          <IconButton size="small" onClick={onEdit}>
            <Edit2 size={16} />
          </IconButton>
        </Box>
        
        {task.description && renderDescription(task.description)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={task.priority}
              color={
                task.priority === 'high'
                  ? 'error'
                  : task.priority === 'medium'
                  ? 'warning'
                  : 'default'
              }
              size="small"
            />
            {task.dueDate && (
              <Chip
                label={new Date(task.dueDate).toLocaleDateString()}
                size="small"
              />
            )}
          </Box>
          
          <TaskStatusSelect
            status={task.status}
            onChange={(newStatus) => onStatusChange(task.id, newStatus as Task['status'])}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;