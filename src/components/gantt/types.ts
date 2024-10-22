import { Task, Project } from '../../types';

export interface GanttTaskType {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'project' | 'task';
  project?: string;
  hideChildren?: boolean;
  styles?: {
    backgroundColor: string;
    progressColor: string;
  };
}

export interface GanttProps {
  tasks: Task[];
  projects: Project[];
}