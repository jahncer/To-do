import { db } from '../db';

export const initializeData = async () => {
  try {
    // Initialize with sample data only if the database is empty
    const userCount = await db.users.count();
    
    if (userCount === 0) {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Add sample users
      const users = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatarUrl: 'https://i.pravatar.cc/150?u=john',
          createdAt: now
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatarUrl: 'https://i.pravatar.cc/150?u=jane',
          createdAt: now
        }
      ];

      // Add sample projects
      const projects = [
        {
          id: '1',
          name: 'Website Redesign',
          color: '#2196f3',
          createdAt: now
        },
        {
          id: '2',
          name: 'Mobile App',
          color: '#4caf50',
          createdAt: now
        }
      ];

      // Add sample tasks
      const tasks = [
        {
          id: '1',
          title: 'Design Homepage',
          description: 'Create new homepage design',
          status: 'todo',
          priority: 'high',
          projectId: '1',
          assignees: ['1'],
          labels: [],
          parentTaskId: null,
          order: 0,
          createdAt: now,
          updatedAt: now,
          start: now,
          end: tomorrow,
          dueDate: tomorrow
        },
        {
          id: '2',
          title: 'Implement API',
          description: 'Build REST API endpoints',
          status: 'in_progress',
          priority: 'medium',
          projectId: '2',
          assignees: ['2'],
          labels: [],
          parentTaskId: null,
          order: 1,
          createdAt: now,
          updatedAt: now,
          start: tomorrow,
          end: nextWeek,
          dueDate: nextWeek
        }
      ];

      // Add data sequentially to maintain referential integrity
      await db.users.bulkAdd(users);
      await db.projects.bulkAdd(projects);
      await db.tasks.bulkAdd(tasks);
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize data:', error);
    throw error;
  }
};