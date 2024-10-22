import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppStore } from './store';
import { useTaskStore } from './store/taskStore';
import { getTheme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import GanttView from './pages/GanttView';
import { initializeData } from './utils/initData';

const App = () => {
  const theme = useAppStore((state) => state.theme);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeData();
        await fetchTasks();
        setIsInitializing(false);
      } catch (error) {
        console.error('Initialization failed:', error);
        setError('Failed to initialize the application. Please refresh the page.');
        setIsInitializing(false);
      }
    };
    init();
  }, [fetchTasks]);

  if (isInitializing) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        p={3}
      >
        <Box color="error.main">{error}</Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="projects" element={<Projects />} />
              <Route path="gantt" element={<GanttView />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;