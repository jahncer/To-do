import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Avatar,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Task, User, Project } from '../types';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import RichTextEditor from './RichTextEditor';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (task: Partial<Task>) => Promise<void>;
}

export default function TaskForm({ open, onClose, task, onSave }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const users = useLiveQuery(() => db.users.toArray()) || [];
  const projects = useLiveQuery(() => db.projects.toArray()) || [];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setProjectId(task.projectId);
      setAssignees(task.assignees);
      setStart(task.start ? new Date(task.start) : null);
      setEnd(task.end ? new Date(task.end) : null);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(null);
      setProjectId(null);
      setAssignees([]);
      setStart(null);
      setEnd(null);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    
    await onSave({
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignees,
      status: task?.status || 'todo',
      labels: task?.labels || [],
      parentTaskId: task?.parentTaskId || null,
      order: task?.order || Date.now(),
      start: start || now,
      end: end || new Date(now.getTime() + 24 * 60 * 60 * 1000),
      updatedAt: now,
    });
    onClose();
  };

  const handleAssigneesChange = (event: SelectChangeEvent<string[]>) => {
    setAssignees(event.target.value as string[]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={projectId || ''}
                label="Project"
                onChange={(e) => setProjectId(e.target.value || null)}
              >
                <MenuItem value="">No Project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Assignees</InputLabel>
              <Select
                multiple
                value={assignees}
                onChange={handleAssigneesChange}
                label="Assignees"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return user ? (
                        <Chip
                          key={userId}
                          avatar={<Avatar src={user.avatarUrl} />}
                          label={user.name}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Start Date"
              value={start}
              onChange={(newValue) => setStart(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <DatePicker
              label="End Date"
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
              <RichTextEditor 
                content={description} 
                onChange={setDescription} 
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}