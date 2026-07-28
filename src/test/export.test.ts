/* ──────────────────────────────────────────────
   Tests — Export Utilities
   ────────────────────────────────────────────── */

import { describe, it, expect } from 'vitest';
import { exportToCSV, exportToJSON, exportToMarkdown } from '../lib/export';
import type { Task } from '../types';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Finish auth endpoints',
    assignee: 'David Kim',
    deadline: 'Wednesday',
    priority: 'high',
    status: 'pending',
    transcriptExcerpt: 'I still need to finish the authentication endpoints by this Wednesday.',
    needsReview: false,
    createdAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Review migration scripts',
    assignee: 'James Wilson',
    deadline: 'Thursday',
    priority: 'medium',
    status: 'approved',
    transcriptExcerpt: 'I can review the migration scripts.',
    needsReview: false,
    createdAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Update project documentation',
    assignee: null,
    deadline: null,
    priority: 'low',
    status: 'pending',
    transcriptExcerpt: 'We need to update the project documentation.',
    needsReview: true,
    createdAt: '2026-07-28T10:00:00.000Z',
  },
];

describe('exportToCSV', () => {
  it('produces valid CSV with headers', () => {
    const csv = exportToCSV(sampleTasks);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(
      'Title,Assignee,Deadline,Priority,Status,Needs Review,Transcript Excerpt,Created At'
    );
    expect(lines).toHaveLength(4); // header + 3 rows
  });

  it('handles null assignee and deadline', () => {
    const csv = exportToCSV(sampleTasks);
    const lastRow = csv.split('\n')[3];
    expect(lastRow).toContain('Unassigned');
    expect(lastRow).toContain('No deadline');
  });

  it('escapes commas in fields', () => {
    const tasks: Task[] = [
      {
        ...sampleTasks[0],
        title: 'Fix bug, then deploy',
      },
    ];
    const csv = exportToCSV(tasks);
    expect(csv).toContain('"Fix bug, then deploy"');
  });

  it('handles empty task list', () => {
    const csv = exportToCSV([]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1); // header only
  });
});

describe('exportToJSON', () => {
  it('produces valid JSON', () => {
    const json = exportToJSON(sampleTasks);
    const parsed = JSON.parse(json);
    expect(parsed.actionItems).toHaveLength(3);
    expect(parsed.exportedAt).toBeDefined();
  });

  it('includes all task fields', () => {
    const json = exportToJSON(sampleTasks);
    const parsed = JSON.parse(json);
    const first = parsed.actionItems[0];
    expect(first.title).toBe('Finish auth endpoints');
    expect(first.assignee).toBe('David Kim');
    expect(first.priority).toBe('high');
    expect(first.status).toBe('pending');
  });

  it('excludes internal id field', () => {
    const json = exportToJSON(sampleTasks);
    const parsed = JSON.parse(json);
    expect(parsed.actionItems[0].id).toBeUndefined();
  });
});

describe('exportToMarkdown', () => {
  it('produces a markdown table', () => {
    const md = exportToMarkdown(sampleTasks);
    expect(md).toContain('# Meeting Action Items');
    expect(md).toContain('| # | Task');
    expect(md).toContain('Finish auth endpoints');
  });

  it('marks items needing review with ⚠️', () => {
    const md = exportToMarkdown(sampleTasks);
    expect(md).toContain('⚠️');
    expect(md).toContain('Needs Review');
  });

  it('handles empty task list', () => {
    const md = exportToMarkdown([]);
    expect(md).toContain('No action items found');
  });

  it('shows unassigned for null assignees', () => {
    const md = exportToMarkdown(sampleTasks);
    expect(md).toContain('_Unassigned_');
  });
});
