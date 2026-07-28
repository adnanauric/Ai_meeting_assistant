/* ──────────────────────────────────────────────
   Export Menu Component
   CSV, JSON, Markdown export + clipboard
   ────────────────────────────────────────────── */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { exportTasks, exportToMarkdown } from '../../lib/export';

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { tasks } = useTaskStore();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCopy = useCallback(async () => {
    try {
      const md = exportToMarkdown(tasks);
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
    setIsOpen(false);
  }, [tasks]);

  return (
    <div className="export-menu-wrapper" ref={menuRef}>
      <button
        id="export-btn"
        className="btn btn-ghost"
        onClick={() => setIsOpen(!isOpen)}
        disabled={tasks.length === 0}
      >
        <Download size={16} />
        Export
      </button>

      {isOpen && (
        <div className="export-menu" role="menu">
          <button
            className="export-menu-item"
            onClick={() => {
              exportTasks(tasks, 'csv');
              setIsOpen(false);
            }}
            role="menuitem"
          >
            <FileSpreadsheet size={16} />
            Export as CSV
          </button>
          <button
            className="export-menu-item"
            onClick={() => {
              exportTasks(tasks, 'json');
              setIsOpen(false);
            }}
            role="menuitem"
          >
            <FileJson size={16} />
            Export as JSON
          </button>
          <button
            className="export-menu-item"
            onClick={() => {
              exportTasks(tasks, 'markdown');
              setIsOpen(false);
            }}
            role="menuitem"
          >
            <FileText size={16} />
            Export as Markdown
          </button>
          <button
            className="export-menu-item"
            onClick={handleCopy}
            role="menuitem"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}
    </div>
  );
}
