/* ──────────────────────────────────────────────
   Tests — TaskTable Component
   ────────────────────────────────────────────── */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskTable } from '../features/tasks/TaskTable';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'test-1',
  title: 'Test Task Alpha',
  assignee: 'Alice',
  deadline: 'Friday',
  priority: 'high',
  status: 'pending',
  transcriptExcerpt: 'We need to do this.',
  needsReview: false,
  createdAt: '2026-07-28T10:00:00.000Z',
  ...overrides,
});

describe('TaskTable', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      processingStatus: 'idle',
      processingError: null,
    });
  });

  it('shows empty state when no tasks', () => {
    render(<TaskTable />);
    expect(screen.getByText('No Action Items Yet')).toBeInTheDocument();
  });

  it('renders tasks in the table', () => {
    useTaskStore.setState({
      tasks: [
        createTask({ id: '1', title: 'Fix authentication bug' }),
        createTask({ id: '2', title: 'Review documentation', priority: 'low' }),
      ],
    });

    render(<TaskTable />);
    expect(screen.getByText('Fix authentication bug')).toBeInTheDocument();
    expect(screen.getByText('Review documentation')).toBeInTheDocument();
  });

  it('shows task count badge', () => {
    useTaskStore.setState({
      tasks: [createTask({ id: '1' }), createTask({ id: '2' })],
    });

    const { container } = render(<TaskTable />);
    const badge = container.querySelector('.tasks-count');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe('2');
  });

  it('shows error state', () => {
    useTaskStore.setState({
      tasks: [],
      processingStatus: 'error',
      processingError: 'Model not found',
    });

    render(<TaskTable />);
    expect(screen.getByText('Extraction Failed')).toBeInTheDocument();
    expect(screen.getByText('Model not found')).toBeInTheDocument();
  });

  it('shows review flag for tasks needing review', () => {
    useTaskStore.setState({
      tasks: [createTask({ id: '1', needsReview: true })],
    });

    render(<TaskTable />);
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('opens add task modal when clicking Add', async () => {
    const user = userEvent.setup();

    useTaskStore.setState({
      tasks: [createTask()],
    });

    render(<TaskTable />);

    const addBtn = screen.getByText('Add');
    await user.click(addBtn);

    expect(screen.getByText('Add Task Manually')).toBeInTheDocument();
  });

  it('deletes a task when clicking delete button', async () => {
    const user = userEvent.setup();

    useTaskStore.setState({
      tasks: [createTask({ id: '1', title: 'To Be Deleted' })],
    });

    render(<TaskTable />);
    expect(screen.getByText('To Be Deleted')).toBeInTheDocument();

    const deleteBtn = screen.getByTitle('Delete task');
    await user.click(deleteBtn);

    expect(screen.queryByText('To Be Deleted')).not.toBeInTheDocument();
  });
});
