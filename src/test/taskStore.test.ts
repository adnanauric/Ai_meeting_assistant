/* ──────────────────────────────────────────────
   Tests — Task Store (Zustand)
   ────────────────────────────────────────────── */

import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'test-1',
  title: 'Test Task',
  assignee: 'Alice',
  deadline: 'Friday',
  priority: 'medium',
  status: 'pending',
  transcriptExcerpt: 'We need to do this.',
  needsReview: false,
  createdAt: '2026-07-28T10:00:00.000Z',
  ...overrides,
});

describe('taskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      processingStatus: 'idle',
      processingError: null,
    });
  });

  it('starts with empty tasks', () => {
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('addTask appends a task', () => {
    const task = createTask();
    useTaskStore.getState().addTask(task);
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe('Test Task');
  });

  it('setTasks replaces all tasks', () => {
    const tasks = [createTask({ id: '1' }), createTask({ id: '2', title: 'Second' })];
    useTaskStore.getState().setTasks(tasks);
    expect(useTaskStore.getState().tasks).toHaveLength(2);
    expect(useTaskStore.getState().processingStatus).toBe('success');
  });

  it('updateTask modifies a specific task', () => {
    useTaskStore.getState().addTask(createTask({ id: '1' }));
    useTaskStore.getState().updateTask('1', { title: 'Updated Title' });
    expect(useTaskStore.getState().tasks[0].title).toBe('Updated Title');
  });

  it('deleteTask removes a specific task', () => {
    useTaskStore.getState().addTask(createTask({ id: '1' }));
    useTaskStore.getState().addTask(createTask({ id: '2' }));
    useTaskStore.getState().deleteTask('1');
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].id).toBe('2');
  });

  it('approveTask sets status to approved and clears review flag', () => {
    useTaskStore.getState().addTask(createTask({ id: '1', needsReview: true }));
    useTaskStore.getState().approveTask('1');
    const task = useTaskStore.getState().tasks[0];
    expect(task.status).toBe('approved');
    expect(task.needsReview).toBe(false);
  });

  it('toggleStatus cycles through pending → approved → completed → pending', () => {
    useTaskStore.getState().addTask(createTask({ id: '1', status: 'pending' }));

    useTaskStore.getState().toggleStatus('1');
    expect(useTaskStore.getState().tasks[0].status).toBe('approved');

    useTaskStore.getState().toggleStatus('1');
    expect(useTaskStore.getState().tasks[0].status).toBe('completed');

    useTaskStore.getState().toggleStatus('1');
    expect(useTaskStore.getState().tasks[0].status).toBe('pending');
  });

  it('clearAll resets state', () => {
    useTaskStore.getState().addTask(createTask());
    useTaskStore.getState().setProcessingStatus('success');
    useTaskStore.getState().clearAll();
    expect(useTaskStore.getState().tasks).toHaveLength(0);
    expect(useTaskStore.getState().processingStatus).toBe('idle');
  });

  it('setProcessingError sets error state', () => {
    useTaskStore.getState().setProcessingError('Something went wrong');
    expect(useTaskStore.getState().processingStatus).toBe('error');
    expect(useTaskStore.getState().processingError).toBe('Something went wrong');
  });
});
