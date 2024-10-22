import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material';
import { Menu, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const currentUser = useAppStore((state) => state.currentUser);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Task Manager
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </IconButton>
          {currentUser && (
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              sx={{ ml: 2 }}
            />
          )}
        </Toolbar>
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'grey.100'
              : 'grey.900',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}