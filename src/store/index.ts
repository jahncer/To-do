import { create } from 'zustand';
import { User } from '../types';

interface AppState {
  theme: 'light' | 'dark';
  currentUser: User | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  currentUser: null,
  setTheme: (theme) => set({ theme }),
  setCurrentUser: (user) => set({ currentUser: user })
}));

// Export the setter functions for use in initialization
export const { setCurrentUser } = useAppStore.getState();