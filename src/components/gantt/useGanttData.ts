import { useMemo } from 'react';
import { ViewMode } from 'gantt-task-react';
import { Task, Project } from '../../types';

interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'project' | 'task';
  project?: string;
  hideChildren?: boolean;
  displayOrder?: number;
  dependencies?: string[];
  isDisabled?: boolean;
  styles?: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
}

const getTaskColor = (priority: string, status: string) => {
  if (status === 'completed') {
    return {
      backgroundColor: '#4caf50',
      backgroundSelectedColor: '#388e3c',
      progressColor: '#2e7d32',
      progressSelectedColor: '#1b5e20'
    };
  }

  switch (priority) {
    case 'high':
      return {
        backgroundColor: '#ef5350',
        backgroundSelectedColor: '#d32f2f',
        progressColor: '#c62828',
        progressSelectedColor: '#b71c1c'
      };
    case 'medium':
      return {
        backgroundColor: '#ff9800',
        backgroundSelectedColor: '#f57c00',
        progressColor: '#ef6c00',
        progressSelectedColor: '#e65100'
      };
    default:
      return {
        backgroundColor: '#66bb6a',
        backgroundSelectedColor: '#43a047',
        progressColor: '#388e3c',
        progressSelectedColor: '#2e7d32'
      };
  }
};

const getProjectProgress = (projectId: string, tasks: Task[]) => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  if (!projectTasks.length) return 0;

  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress').length;
  
  return Math.round(((completedTasks + (inProgressTasks * 0.5)) / projectTasks.length) * 100);
};

export const useGanttData = (tasks: Task[] | undefined, projects: Project[] | undefined) => {
  const ganttTasks = useMemo(() => {
    if (!tasks?.length && !projects?.length) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      return [{
        id: 'default',
        name: 'No tasks available',
        start: today,
        end: tomorrow,
        progress: 0,
        type: 'task',
        styles: {
          backgroundColor: '#e0e0e0',
          backgroundSelectedColor: '#bdbdbd',
          progressColor: '#9e9e9e',
          progressSelectedColor: '#757575'
        }
      }];
    }

    const ganttItems: GanttTask[] = [];
    let displayOrder = 0;

    // Process projects and their tasks
    (projects || []).forEach(project => {
      // Get all tasks for this project
      const projectTasksList = (tasks || []).filter(task => task.projectId === project.id);
      
      // Calculate project dates based on tasks
      const startDates = projectTasksList.map(task => new Date(task.start).getTime());
      const endDates = projectTasksList.map(task => new Date(task.end).getTime());
      
      const start = startDates.length > 0 
        ? new Date(Math.min(...startDates))
        : new Date();
      const end = endDates.length > 0
        ? new Date(Math.max(...endDates))
        : new Date(start.getTime() + 86400000);

      // Add project
      ganttItems.push({
        id: `project-${project.id}`,
        name: project.name,
        start,
        end,
        progress: getProjectProgress(project.id, tasks || []),
        type: 'project',
        hideChildren: false,
        displayOrder: displayOrder++,
        styles: {
          backgroundColor: '#2196f3',
          backgroundSelectedColor: '#1976d2',
          progressColor: '#1565c0',
          progressSelectedColor: '#0d47a1'
        }
      });

      // Add project tasks
      projectTasksList.forEach(task => {
        ganttItems.push({
          id: `task-${task.id}`,
          name: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
          progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
          type: 'task',
          project: `project-${project.id}`,
          displayOrder: displayOrder++,
          styles: getTaskColor(task.priority, task.status)
        });
      });
    });

    // Add unassigned tasks at the end
    const unassignedTasks = (tasks || []).filter(task => !task.projectId);
    unassignedTasks.forEach(task => {
      ganttItems.push({
        id: `task-${task.id}`,
        name: task.title,
        start: new Date(task.start),
        end: new Date(task.end),
        progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
        type: 'task',
        displayOrder: displayOrder++,
        styles: getTaskColor(task.priority, task.status)
      });
    });

    return ganttItems;
  }, [tasks, projects]);

  const chartHeight = useMemo(() => {
    if (!tasks?.length && !projects?.length) return 400;

    const projectCount = projects?.length || 0;
    const tasksByProject = projects?.reduce((acc, project) => {
      const projectTasks = tasks?.filter(task => task.projectId === project.id).length || 0;
      return acc + projectTasks;
    }, 0) || 0;
    const unassignedTasks = (tasks?.filter(task => !task.projectId).length || 0);

    const totalItems = projectCount + tasksByProject + unassignedTasks;
    const rowHeight = 50;
    const headerHeight = 50;
    const minHeight = 400;
    const padding = 100; // Extra padding for better visibility

    return Math.max(minHeight, (totalItems * rowHeight) + headerHeight + padding);
  }, [tasks, projects]);

  return {
    ganttTasks,
    viewMode: ViewMode.Week as ViewMode,
    chartHeight
  };
};