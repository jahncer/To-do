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
  Avatar,
  IconButton,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { User } from '../types';
import AvatarUpload from '../components/AvatarUpload';

interface UserFormData {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function Settings() {
  const [openForm, setOpenForm] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [formData, setFormData] = React.useState<UserFormData>({
    name: '',
    email: '',
    avatarUrl: '',
  });

  const users = useLiveQuery(() => db.users.toArray()) || [];

  const handleOpenForm = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        avatarUrl: '',
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      avatarUrl: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      await db.users.update(selectedUser.id, {
        ...formData,
        updatedAt: new Date(),
      });
    } else {
      await db.users.add({
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      });
    }
    handleCloseForm();
  };

  const handleDeleteUser = async (userId: string) => {
    // Remove user from task assignments before deletion
    const tasks = await db.tasks.where('assignees').equals(userId).toArray();
    await Promise.all(
      tasks.map((task) => {
        const newAssignees = task.assignees.filter((id) => id !== userId);
        return db.tasks.update(task.id, { assignees: newAssignees });
      })
    );
    await db.users.delete(userId);
  };

  const handleAvatarChange = (dataUrl: string) => {
    setFormData({ ...formData, avatarUrl: dataUrl });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Settings</Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => handleOpenForm()}
            >
              Add User
            </Button>
          </Box>

          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={user.avatarUrl}
                        alt={user.name}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenForm(user)}
                        color="primary"
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <AvatarUpload
                  currentUrl={formData.avatarUrl}
                  onImageSelect={handleAvatarChange}
                />
              </Box>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Save Changes' : 'Add User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}