import React from 'react';
import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import { Gantt } from 'gantt-task-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { useGanttData } from './useGanttData';
import 'gantt-task-react/dist/index.css';
import './gantt.css';

const GanttChart: React.FC = () => {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const projects = useLiveQuery(() => db.projects.toArray());
  const { ganttTasks, viewMode, chartHeight } = useGanttData(tasks, projects);

  if (!tasks || !projects) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ 
          height: chartHeight, 
          overflow: 'auto',
          '& .gantt-task-react__task-side': {
            paddingLeft: (theme) => theme.spacing(2)
          }
        }}>
          <Gantt
            tasks={ganttTasks}
            viewMode={viewMode}
            listCellWidth={320}
            columnWidth={65}
            ganttHeight={chartHeight}
            barCornerRadius={4}
            handleWidth={8}
            todayColor="rgba(252, 251, 227, 0.4)"
            projectProgressBar={true}
            progressBarCornerRadius={4}
            selectedTask={null}
            enableTaskDrag={false}
            viewDate={new Date()}
            preStepsCount={1}
            headerHeight={50}
            rowHeight={50}
            rtl={false}
            barProgressColor="#a3a3ff"
            barProgressSelectedColor="#8282f5"
            barBackgroundColor="#b8c2cc"
            barBackgroundSelectedColor="#aeb8c2"
            projectBackgroundColor="#bac4d0"
            projectBackgroundSelectedColor="#aeb8c2"
            projectProgressBackgroundColor="#8d99a6"
            projectProgressSelectedBackgroundColor="#767e88"
            onExpanderClick={(task) => {
              console.log('Expanding task:', task);
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GanttChart;