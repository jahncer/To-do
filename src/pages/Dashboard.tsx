import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Task, User } from '../types';

const Dashboard = () => {
  const users = useLiveQuery(() => db.users.toArray()) || [];
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const projects = useLiveQuery(() => db.projects.toArray()) || [];

  const getTasksByUser = (userId: string) => {
    return tasks.filter(task => task.assignees.includes(userId));
  };

  const unassignedTasks = tasks.filter(task => task.assignees.length === 0);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'default';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Team Members
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
          {users.map((user) => (
            <Box key={user.id} sx={{ textAlign: 'center' }}>
              <Avatar
                alt={user.name}
                src={user.avatarUrl}
                sx={{ width: 80, height: 80, mb: 1, mx: 'auto' }}
              />
              <Typography variant="subtitle2">{user.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={user.avatarUrl} sx={{ width: 48, height: 48, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getTasksByUser(user.id).length} assigned tasks
                    </Typography>
                  </Box>
                </Box>
                {getTasksByUser(user.id).map((task) => (
                  <Card variant="outlined" key={task.id} sx={{ mb: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{task.title}</Typography>
                      <Chip
                        size="small"
                        label={task.status.replace('_', ' ')}
                        color={getStatusColor(task.status)}
                      />
                    </Box>
                    {task.projectId && (
                      <Typography variant="caption" color="text.secondary">
                        {projects.find(p => p.id === task.projectId)?.name}
                      </Typography>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {unassignedTasks.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ bgcolor: (theme) => theme.palette.error.light }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Unassigned Tasks ({unassignedTasks.length})
                </Typography>
                {unassignedTasks.map((task) => (
                  <Card key={task.id} sx={{ mb: 1, p: 2 }}>
                    <Typography variant="body2">{task.title}</Typography>
                    {task.projectId && (
                      <Typography variant="caption" color="text.secondary">
                        {projects.find(p => p.id === task.projectId)?.name}
                      </Typography>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;