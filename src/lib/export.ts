/* ──────────────────────────────────────────────
   Export Utilities — CSV, JSON, Markdown
   ────────────────────────────────────────────── */

import type { Task, ExportFormat } from '../types';

/**
 * Escape a field for CSV (RFC 4180).
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export tasks to RFC 4180 compliant CSV.
 */
export function exportToCSV(tasks: Task[]): string {
  const headers = [
    'Title',
    'Assignee',
    'Deadline',
    'Priority',
    'Status',
    'Needs Review',
    'Transcript Excerpt',
    'Created At',
  ];

  const rows = tasks.map((task) => [
    csvEscape(task.title),
    csvEscape(task.assignee ?? 'Unassigned'),
    csvEscape(task.deadline ?? 'No deadline'),
    csvEscape(task.priority),
    csvEscape(task.status),
    task.needsReview ? 'Yes' : 'No',
    csvEscape(task.transcriptExcerpt),
    csvEscape(task.createdAt),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Export tasks to pretty-printed JSON.
 */
export function exportToJSON(tasks: Task[]): string {
  const exportData = tasks.map((task) => ({
    title: task.title,
    assignee: task.assignee,
    deadline: task.deadline,
    priority: task.priority,
    status: task.status,
    needsReview: task.needsReview,
    transcriptExcerpt: task.transcriptExcerpt,
    createdAt: task.createdAt,
  }));

  return JSON.stringify({ actionItems: exportData, exportedAt: new Date().toISOString() }, null, 2);
}

/**
 * Export tasks to a clean Markdown document.
 */
export function exportToMarkdown(tasks: Task[]): string {
  const lines: string[] = [
    '# Meeting Action Items',
    '',
    `> Exported on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    '',
  ];

  if (tasks.length === 0) {
    lines.push('_No action items found._');
    return lines.join('\n');
  }

  // Summary table
  lines.push('| # | Task | Assignee | Deadline | Priority | Status |');
  lines.push('|---|------|----------|----------|----------|--------|');

  tasks.forEach((task, index) => {
    const reviewFlag = task.needsReview ? ' ⚠️' : '';
    lines.push(
      `| ${index + 1} | ${task.title}${reviewFlag} | ${task.assignee ?? '_Unassigned_'} | ${task.deadline ?? '_No deadline_'} | ${task.priority} | ${task.status} |`
    );
  });

  // Detailed section
  lines.push('', '---', '', '## Details', '');

  tasks.forEach((task, index) => {
    lines.push(`### ${index + 1}. ${task.title}`);
    if (task.needsReview) {
      lines.push('> ⚠️ **Needs Review** — Some information may be uncertain.');
    }
    lines.push('');
    lines.push(`- **Assignee:** ${task.assignee ?? '_Unassigned_'}`);
    lines.push(`- **Deadline:** ${task.deadline ?? '_No deadline_'}`);
    lines.push(`- **Priority:** ${task.priority}`);
    lines.push(`- **Status:** ${task.status}`);
    if (task.transcriptExcerpt) {
      lines.push(`- **From transcript:** _"${task.transcriptExcerpt}"_`);
    }
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Trigger a browser file download.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export tasks in the specified format and trigger download.
 */
export function exportTasks(tasks: Task[], format: ExportFormat): void {
  const timestamp = new Date().toISOString().split('T')[0];

  switch (format) {
    case 'csv':
      downloadFile(exportToCSV(tasks), `action-items-${timestamp}.csv`, 'text/csv');
      break;
    case 'json':
      downloadFile(exportToJSON(tasks), `action-items-${timestamp}.json`, 'application/json');
      break;
    case 'markdown':
      downloadFile(exportToMarkdown(tasks), `action-items-${timestamp}.md`, 'text/markdown');
      break;
  }
}
