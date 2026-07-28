/* ──────────────────────────────────────────────
   Task Table Component — Main results view
   ────────────────────────────────────────────── */

import { useState, useMemo } from 'react';
import {
  ListTodo,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskRow } from './TaskRow';
import { AddTaskModal } from './AddTaskModal';
import { ExportMenu } from './ExportMenu';
import type { Task } from '../../types';
import './tasks.css';

type SortField = 'title' | 'assignee' | 'deadline' | 'priority' | 'status';
type SortDir = 'asc' | 'desc';

const priorityOrder = { high: 0, medium: 1, low: 2, unspecified: 3 };
const statusOrder = { pending: 0, approved: 1, completed: 2 };

export function TaskTable() {
  const { tasks, processingStatus, processingError, clearAll } = useTaskStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'assignee':
          cmp = (a.assignee ?? 'zzz').localeCompare(b.assignee ?? 'zzz');
          break;
        case 'deadline':
          cmp = (a.deadline ?? 'zzz').localeCompare(b.deadline ?? 'zzz');
          break;
        case 'priority':
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          cmp = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [tasks, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const reviewCount = tasks.filter((t) => t.needsReview).length;
    const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const approvedCount = tasks.filter((t) => t.status === 'approved').length;
    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    return { reviewCount, pendingCount, approvedCount, completedCount };
  }, [tasks]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUp size={12} className="sort-icon" />;
    return sortDir === 'asc' ? (
      <ArrowUp size={12} className="sort-icon" />
    ) : (
      <ArrowDown size={12} className="sort-icon" />
    );
  };

  // Error state
  if (processingStatus === 'error' && tasks.length === 0) {
    return (
      <div className="tasks-section">
        <div className="tasks-header">
          <div className="tasks-header-left">
            <h2>
              <ListTodo size={22} />
              Action Items
            </h2>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
          <div className="empty-state">
            <AlertCircle size={48} className="empty-state-icon" style={{ color: 'var(--color-error)' }} />
            <h3>Extraction Failed</h3>
            <p>{processingError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0 && processingStatus !== 'processing') {
    return (
      <div className="tasks-section">
        <div className="tasks-header">
          <div className="tasks-header-left">
            <h2>
              <ListTodo size={22} />
              Action Items
            </h2>
          </div>
          <div className="tasks-header-right">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={14} />
              Add Manually
            </button>
          </div>
        </div>
        <div className="glass-card">
          <div className="empty-state">
            <ClipboardList size={56} className="empty-state-icon" />
            <h3>No Action Items Yet</h3>
            <p>
              Paste a meeting transcript and click "Extract Action Items" to get
              started, or add tasks manually.
            </p>
          </div>
        </div>
        {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
      </div>
    );
  }

  return (
    <div className="tasks-section">
      {/* Header */}
      <div className="tasks-header">
        <div className="tasks-header-left">
          <h2>
            <ListTodo size={22} />
            Action Items
          </h2>
          <span className="tasks-count">{tasks.length}</span>
        </div>
        <div className="tasks-header-right">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} />
            Add
          </button>
          <ExportMenu />
          <button
            className="btn btn-danger btn-sm"
            onClick={clearAll}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="tasks-stats">
        <div className="tasks-stat">
          <Clock size={12} />
          <strong>{stats.pendingCount}</strong> Pending
        </div>
        <div className="tasks-stat">
          <CheckCircle2 size={12} />
          <strong>{stats.approvedCount}</strong> Approved
        </div>
        <div className="tasks-stat">
          <CheckCircle2 size={12} />
          <strong>{stats.completedCount}</strong> Completed
        </div>
        {stats.reviewCount > 0 && (
          <div className="tasks-stat" style={{ color: 'var(--color-warning)' }}>
            <AlertTriangle size={12} />
            <strong>{stats.reviewCount}</strong> Needs Review
          </div>
        )}
      </div>

      {/* Table */}
      <div className="task-table-wrapper">
        <table className="task-table" id="task-table">
          <thead>
            <tr>
              <th
                className={sortField === 'title' ? 'sorted' : ''}
                onClick={() => handleSort('title')}
              >
                Task <SortIcon field="title" />
              </th>
              <th
                className={sortField === 'assignee' ? 'sorted' : ''}
                onClick={() => handleSort('assignee')}
              >
                Assignee <SortIcon field="assignee" />
              </th>
              <th
                className={sortField === 'deadline' ? 'sorted' : ''}
                onClick={() => handleSort('deadline')}
              >
                Deadline <SortIcon field="deadline" />
              </th>
              <th
                className={sortField === 'priority' ? 'sorted' : ''}
                onClick={() => handleSort('priority')}
              >
                Priority <SortIcon field="priority" />
              </th>
              <th
                className={sortField === 'status' ? 'sorted' : ''}
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task: Task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
