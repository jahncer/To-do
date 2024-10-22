import Dexie, { Table } from 'dexie';
import { User, Task, Project, Label } from '../types';

export class TaskDatabase extends Dexie {
  users!: Table<User>;
  tasks!: Table<Task>;
  projects!: Table<Project>;
  labels!: Table<Label>;

  constructor() {
    super('TaskDatabase');
    
    this.version(1).stores({
      users: '++id, name, email, createdAt',
      tasks: '++id, title, status, priority, projectId, dueDate, createdAt',
      projects: '++id, name, color, createdAt',
      labels: '++id, name, color'
    });
  }
}

export const db = new TaskDatabase();