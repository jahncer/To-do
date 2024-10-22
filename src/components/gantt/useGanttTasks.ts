import { useMemo } from 'react';
import { GanttTaskType, GanttProps } from './types';

const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  return { today, tomorrow };
};

export const useGanttTasks = ({ tasks, projects }: GanttProps) => {
  return useMemo(() => {
    const { today, tomorrow } = getDefaultDates();

    // Always provide at least one task to prevent the "start" property error
    if (!tasks?.length && !projects?.length) {
      return [{
        id: 'placeholder',
        name: 'No tasks or projects yet',
        start: today,
        end: tomorrow,
        progress: 0,
        type: 'task',
        styles: { backgroundColor: '#e0e0e0', progressColor: '#ffffff33' }
      }];
    }

    const projectTasks: GanttTaskType[] = (projects || []).map(project => ({
      id: project.id,
      name: project.name,
      start: new Date(project.startDate || today),
      end: new Date(project.endDate || tomorrow),
      progress: 0,
      type: 'project',
      hideChildren: false,
      styles: { backgroundColor: '#90caf9', progressColor: '#ffffff33' }
    }));

    const taskItems: GanttTaskType[] = (tasks || []).map(task => ({
      id: task.id,
      name: task.title,
      start: new Date(task.startDate || today),
      end: new Date(task.dueDate || tomorrow),
      progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
      type: 'task',
      project: task.projectId,
      styles: {
        backgroundColor: task.priority === 'high' ? '#ef5350' : 
                        task.priority === 'medium' ? '#42a5f5' : '#66bb6a',
        progressColor: '#ffffff33'
      }
    }));

    return [...projectTasks, ...taskItems];
  }, [tasks, projects]);
};