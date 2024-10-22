import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ViewMode, Gantt } from 'gantt-task-react';
import { Task as GanttTaskType } from 'gantt-task-react/dist/types/public-types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Task } from '../types';
import 'gantt-task-react/dist/index.css';

interface GanttTask extends GanttTaskType {
  project?: string;
}

const GanttChart: React.FC = () => {
  const [viewMode] = useState<ViewMode>(ViewMode.Week);
  const [listCellWidth, setListCellWidth] = useState(320);
  const [columnWidth, setColumnWidth] = useState(65);
  const [chartHeight, setChartHeight] = useState(400);
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const projects = useLiveQuery(() => db.projects.toArray()) || [];

  const getTaskProgress = (task: Task): number => {
    return task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0;
  };

  const getTaskBarColor = (task: Task): string => {
    switch (task.priority) {
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#42a5f5';
      case 'low':
        return '#66bb6a';
      default:
        return '#90a4ae';
    }
  };

  const getProjectBarColor = (projectId: string): string => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const hasHighPriority = projectTasks.some(t => t.priority === 'high');
    const hasMediumPriority = projectTasks.some(t => t.priority === 'medium');
    
    if (hasHighPriority) return '#ef5350';
    if (hasMediumPriority) return '#42a5f5';
    return '#66bb6a';
  };

  const calculateChartHeight = (taskCount: number) => {
    const rowHeight = 40;
    const headerHeight = 50;
    const minHeight = 400;
    const calculatedHeight = (taskCount * rowHeight) + headerHeight;
    return Math.max(minHeight, calculatedHeight);
  };

  useEffect(() => {
    const totalItems = projects.length + tasks.length;
    setChartHeight(calculateChartHeight(totalItems));
  }, [projects, tasks]);

  const ganttTasks: GanttTask[] = [
    ...projects.map(project => ({
      id: project.id,
      name: project.name,
      start: new Date(project.startDate),
      end: new Date(project.endDate),
      progress: 0,
      type: 'project',
      hideChildren: false,
      displayOrder: 0,
      styles: { backgroundColor: getProjectBarColor(project.id), progressColor: '#ffffff33' }
    })),
    ...tasks.map(task => ({
      id: task.id,
      name: task.title,
      start: new Date(task.startDate),
      end: new Date(task.dueDate),
      progress: getTaskProgress(task),
      project: task.projectId,
      type: 'task',
      displayOrder: 1,
      styles: { backgroundColor: getTaskBarColor(task), progressColor: '#ffffff33' }
    }))
  ].sort((a, b) => {
    if (a.type === 'project' && b.type !== 'project') return -1;
    if (a.type !== 'project' && b.type === 'project') return 1;
    return a.displayOrder - b.displayOrder;
  });

  const handleTaskListResizing = (width: number) => {
    setListCellWidth(width);
  };

  const handleTaskTableResizing = (width: number) => {
    setColumnWidth(width);
  };

  const defaultViewDate = ganttTasks.length > 0 
    ? new Date(Math.min(...ganttTasks.map(t => t.start.getTime())))
    : new Date();

  return (
    <Box sx={{
      '& .gantt-task-react': {
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      '& .gantt-task-react__list': {
        background: '#fff',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#2196f3',
          }
        },
        '& .gantt-task-react__list-header': {
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #e0e0e0',
          padding: '12px 16px',
          '& .gantt-task-react__list-header-label': {
            color: '#616161',
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'uppercase',
          }
        },
        '& .gantt-task-react__list-item': {
          padding: '8px 16px',
          borderBottom: '1px solid #f5f5f5',
          fontSize: '0.875rem',
          color: '#424242',
          '&--project': {
            backgroundColor: '#f5f5f5',
            fontWeight: 500,
            color: '#212121',
          }
        }
      },
      '& .gantt-task-react__task': {
        borderRadius: '4px',
        height: '28px !important',
        marginTop: '6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        '&--project': {
          height: '24px !important',
          marginTop: '8px',
        }
      },
      '& .gantt-task-react__task-progress': {
        borderRadius: '4px',
        height: '28px !important',
        '&--project': {
          height: '24px !important',
        }
      },
      '& .gantt-task-react__chart-timeline-grid-row': {
        borderBottom: '1px solid #f5f5f5',
      },
      '& .gantt-task-react__chart-timeline-header': {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e0e0e0',
        '& .gantt-task-react__chart-timeline-header-tick': {
          color: '#757575',
          fontSize: '0.75rem',
        }
      },
      '& .gantt-task-react__table-column-resizer': {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        cursor: 'col-resize',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: '#2196f3',
        }
      },
      height: `${chartHeight}px`,
      maxHeight: '80vh',
      overflow: 'auto',
    }}>
      <Gantt
        tasks={ganttTasks}
        viewMode={viewMode}
        listCellWidth={`${listCellWidth}px`}
        columnWidth={columnWidth}
        ganttHeight={chartHeight}
        barCornerRadius={4}
        handleWidth={8}
        todayColor="rgba(252, 251, 227, 0.4)"
        projectProgressBar={true}
        progressBarCornerRadius={4}
        selectedTask={null}
        enableTaskDrag={false}
        viewDate={defaultViewDate}
        preStepsCount={1}
        headerHeight={50}
        rowHeight={40}
        rtl={false}
        onGridColumnResize={handleTaskTableResizing}
        onListCellWidth={handleTaskListResizing}
      />
    </Box>
  );
};

export default GanttChart;