/* ──────────────────────────────────────────────
   Task Store — Zustand state management
   ────────────────────────────────────────────── */

import { create } from 'zustand';
import type { Task, ProcessingStatus } from '../types';

interface TaskState {
  tasks: Task[];
  processingStatus: ProcessingStatus;
  processingError: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  approveTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  clearAll: () => void;
  setProcessingStatus: (status: ProcessingStatus) => void;
  setProcessingError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  processingStatus: 'idle',
  processingError: null,

  setTasks: (tasks) =>
    set({ tasks, processingStatus: 'success', processingError: null }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  approveTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: 'approved' as const, needsReview: false } : t
      ),
    })),

  toggleStatus: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== id) return t;
        const next: Record<string, Task['status']> = {
          pending: 'approved',
          approved: 'completed',
          completed: 'pending',
        };
        return { ...t, status: next[t.status] || 'pending' };
      }),
    })),

  clearAll: () =>
    set({ tasks: [], processingStatus: 'idle', processingError: null }),

  setProcessingStatus: (status) =>
    set({ processingStatus: status }),

  setProcessingError: (error) =>
    set({ processingError: error, processingStatus: 'error' }),
}));
