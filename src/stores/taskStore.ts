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

const initialTasks: Task[] = [
  {
    id: 'demo-1',
    title: 'Configure your local AI server in Settings',
    assignee: 'You',
    deadline: 'Today',
    priority: 'high',
    status: 'pending',
    transcriptExcerpt: 'Before extracting tasks, make sure to connect to Ollama or LM Studio in the bottom left panel.',
    needsReview: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Paste a meeting transcript and extract action items',
    assignee: 'You',
    deadline: null,
    priority: 'medium',
    status: 'pending',
    transcriptExcerpt: 'Click "Load Sample" to test the AI, or paste your own meeting notes.',
    needsReview: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Review tasks flagged by the AI for accuracy',
    assignee: 'Unknown',
    deadline: 'Next week',
    priority: 'low',
    status: 'pending',
    transcriptExcerpt: 'The AI will flag tasks like this one if it is unsure about the assignee or deadline. You can double click rows to edit them.',
    needsReview: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Export your action items',
    assignee: 'Team',
    deadline: null,
    priority: 'unspecified',
    status: 'completed',
    transcriptExcerpt: 'Once approved, download your tasks as CSV, JSON, or Markdown from the top right menu.',
    needsReview: false,
    createdAt: new Date().toISOString(),
  }
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
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
