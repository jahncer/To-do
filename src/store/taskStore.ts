import { create } from 'zustand';
import { Task } from '../types';
import { db } from '../db';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await db.tasks.toArray();
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch tasks' });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const now = new Date();
      const task: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(task);
      const tasks = await db.tasks.toArray();
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to add task' });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true });
    try {
      await db.tasks.update(id, { ...updates, updatedAt: new Date() });
      const tasks = await db.tasks.toArray();
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update task' });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true });
    try {
      await db.tasks.delete(id);
      const tasks = await db.tasks.toArray();
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete task' });
    }
  },
}));