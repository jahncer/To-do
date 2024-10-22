import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import TaskColumn from '../components/TaskColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Task } from '../types';

const TASK_STATUS = ['todo', 'in_progress', 'completed'] as const;

const Tasks = () => {
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const handleTaskSave = async (taskData: Partial<Task>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, taskData);
    } else {
      await addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setOpenTaskForm(false);
    setSelectedTask(null);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await updateTask(taskId, { status: newStatus });
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenTaskForm(true)}
        >
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {TASK_STATUS.map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <TaskColumn title={status.replace('_', ' ').toUpperCase()}>
              {getTasksByStatus(status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={() => {
                    setSelectedTask(task);
                    setOpenTaskForm(true);
                  }}
                />
              ))}
            </TaskColumn>
          </Grid>
        ))}
      </Grid>

      <TaskForm
        open={openTaskForm}
        onClose={() => {
          setOpenTaskForm(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleTaskSave}
      />
    </Box>
  );
};

export default Tasks;