import { SxProps } from '@mui/material';

export const ganttStyles: SxProps = {
  '& .gantt-task-react': {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 1,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
    },
    '& .gantt-task-react__list': {
      background: '#fff',
      '& .gantt-task-react__list-header': {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 16px',
        '& .gantt-task-react__list-header-label': {
          color: '#616161',
          fontSize: '0.875rem',
          fontWeight: 500,
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
        }
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
    }
  }
};