/* ──────────────────────────────────────────────
   Add Task Modal — Manual task creation
   ────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Priority } from '../../types';
import { useTaskStore } from '../../stores/taskStore';

interface AddTaskModalProps {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const { addTask } = useTaskStore();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      addTask({
        id: uuidv4(),
        title: title.trim(),
        assignee: assignee.trim() || null,
        deadline: deadline.trim() || null,
        priority,
        status: 'pending',
        transcriptExcerpt: '',
        needsReview: false,
        createdAt: new Date().toISOString(),
      });

      onClose();
    },
    [title, assignee, deadline, priority, addTask, onClose]
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Task Manually</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="label" htmlFor="add-task-title">
                Task Title *
              </label>
              <input
                id="add-task-title"
                className="input"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="add-task-assignee">
                  Assignee
                </label>
                <input
                  id="add-task-assignee"
                  className="input"
                  type="text"
                  placeholder="Who is responsible?"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="add-task-deadline">
                  Deadline
                </label>
                <input
                  id="add-task-deadline"
                  className="input"
                  type="text"
                  placeholder="e.g. Friday, next week"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="add-task-priority">
                Priority
              </label>
              <select
                id="add-task-priority"
                className="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
                <option value="unspecified">⚪ Unspecified</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
