import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Project, Task } from '../types';

export default function Projects() {
  const [openForm, setOpenForm] = React.useState(false);
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#2196f3');

  const projects = useLiveQuery(() => db.projects.toArray()) || [];
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const users = useLiveQuery(() => db.users.toArray()) || [];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.projects.add({
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date(),
    });
    setOpenForm(false);
    setName('');
    setColor('#2196f3');
  };

  const handleDeleteProject = async (projectId: string) => {
    await db.projects.delete(projectId);
    // Update tasks to remove project reference
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    await Promise.all(
      projectTasks.map((task) =>
        db.tasks.update(task.id, { projectId: null })
      )
    );
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenForm(true)}
        >
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: project.color,
                      mr: 2,
                    }}
                  />
                  <Typography variant="h6">{project.name}</Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Tasks ({tasks.filter((t) => t.projectId === project.id).length})
                </Typography>

                {tasks
                  .filter((task) => task.projectId === project.id)
                  .map((task) => (
                    <Card variant="outlined" key={task.id} sx={{ mb: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{task.title}</Typography>
                        <Chip
                          size="small"
                          label={task.status.replace('_', ' ')}
                          color={getStatusColor(task.status)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {task.assignees.map((userId) => {
                          const user = users.find(u => u.id === userId);
                          return user ? (
                            <Avatar
                              key={userId}
                              src={user.avatarUrl}
                              alt={user.name}
                              sx={{ width: 24, height: 24 }}
                            />
                          ) : null;
                        })}
                      </Box>
                    </Card>
                  ))}

                <Button
                  color="error"
                  onClick={() => handleDeleteProject(project.id)}
                  sx={{ mt: 2 }}
                >
                  Delete Project
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <form onSubmit={handleCreateProject}>
          <DialogTitle>New Project</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}