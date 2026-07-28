/* ──────────────────────────────────────────────
   Task Row Component — Individual task row
   with inline editing and actions
   ────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import {
  Check,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  X,
  Save,
} from 'lucide-react';
import type { Task, Priority, TaskStatus } from '../../types';
import { useTaskStore } from '../../stores/taskStore';

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    assignee: task.assignee ?? '',
    deadline: task.deadline ?? '',
    priority: task.priority,
  });

  const { updateTask, deleteTask, approveTask, toggleStatus } = useTaskStore();

  const handleSave = useCallback(() => {
    updateTask(task.id, {
      title: editData.title,
      assignee: editData.assignee.trim() || null,
      deadline: editData.deadline.trim() || null,
      priority: editData.priority,
      needsReview: false,
    });
    setIsEditing(false);
  }, [task.id, editData, updateTask]);

  const handleCancel = useCallback(() => {
    setEditData({
      title: task.title,
      assignee: task.assignee ?? '',
      deadline: task.deadline ?? '',
      priority: task.priority,
    });
    setIsEditing(false);
  }, [task]);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusBadge = (status: TaskStatus) => (
    <span
      className={`badge badge-${status}`}
      onClick={() => toggleStatus(task.id)}
      style={{ cursor: 'pointer' }}
      title="Click to cycle status"
    >
      {status}
    </span>
  );

  const priorityBadge = (priority: Priority) => (
    <span className={`badge badge-${priority}`}>{priority}</span>
  );

  if (isEditing) {
    return (
      <tr className={task.needsReview ? 'needs-review' : ''}>
        <td>
          <input
            className="inline-edit-input"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Task title"
            autoFocus
          />
        </td>
        <td>
          <input
            className="inline-edit-input"
            value={editData.assignee}
            onChange={(e) =>
              setEditData({ ...editData, assignee: e.target.value })
            }
            placeholder="Assignee"
          />
        </td>
        <td>
          <input
            className="inline-edit-input"
            value={editData.deadline}
            onChange={(e) =>
              setEditData({ ...editData, deadline: e.target.value })
            }
            placeholder="Deadline"
          />
        </td>
        <td>
          <select
            className="inline-edit-input"
            value={editData.priority}
            onChange={(e) =>
              setEditData({
                ...editData,
                priority: e.target.value as Priority,
              })
            }
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unspecified">Unspecified</option>
          </select>
        </td>
        <td>{statusBadge(task.status)}</td>
        <td>
          <div className="task-actions">
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={handleSave}
              title="Save changes"
            >
              <Save size={14} />
            </button>
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={handleCancel}
              title="Cancel editing"
            >
              <X size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className={task.needsReview ? 'needs-review' : ''}>
        <td>
          <div className="task-title-cell">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="task-title">{task.title}</span>
              {task.needsReview && (
                <span className="review-flag" title="This item needs manual review">
                  <AlertTriangle size={10} />
                  Review
                </span>
              )}
            </div>
            {task.transcriptExcerpt && (
              <span
                className="task-excerpt-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                {isExpanded ? 'Hide excerpt' : 'Show excerpt'}
              </span>
            )}
          </div>
        </td>
        <td>
          <div className="assignee-cell">
            {task.assignee ? (
              <>
                <span className="assignee-avatar">
                  {getInitials(task.assignee)}
                </span>
                {task.assignee}
              </>
            ) : (
              <span className="assignee-unassigned">Unassigned</span>
            )}
          </div>
        </td>
        <td>{task.deadline ?? <span className="text-muted">—</span>}</td>
        <td>{priorityBadge(task.priority)}</td>
        <td>{statusBadge(task.status)}</td>
        <td>
          <div className="task-actions">
            {task.status !== 'approved' && task.status !== 'completed' && (
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => approveTask(task.id)}
                title="Approve task"
              >
                <Check size={14} />
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => setIsEditing(true)}
              title="Edit task"
            >
              <Pencil size={14} />
            </button>
            <button
              className="btn btn-danger btn-sm btn-icon"
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && task.transcriptExcerpt && (
        <tr>
          <td colSpan={6} style={{ padding: '0 var(--space-4) var(--space-3)' }}>
            <div className="task-excerpt">"{task.transcriptExcerpt}"</div>
          </td>
        </tr>
      )}
    </>
  );
}
