export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignees: string[];
  projectId: string;
  labels: string[];
  parentTaskId: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  start: Date;
  end: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}