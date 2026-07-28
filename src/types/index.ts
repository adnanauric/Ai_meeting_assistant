/* ──────────────────────────────────────────────
   AI Meeting Assistant — Shared Type Definitions
   ────────────────────────────────────────────── */

/** Priority levels for action items */
export type Priority = 'high' | 'medium' | 'low' | 'unspecified';

/** Task lifecycle status */
export type TaskStatus = 'pending' | 'approved' | 'completed';

/** Supported API formats for local AI servers */
export type ApiFormat = 'ollama' | 'openai';

/** Connection state for the AI server */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/** A single action item extracted from a meeting transcript */
export interface Task {
  id: string;
  title: string;
  assignee: string | null;
  deadline: string | null;
  priority: Priority;
  status: TaskStatus;
  transcriptExcerpt: string;
  needsReview: boolean;
  createdAt: string;
}

/** AI server configuration */
export interface AISettings {
  serverUrl: string;
  apiFormat: ApiFormat;
  model: string;
  temperature: number;
  connectionStatus: ConnectionStatus;
  availableModels: string[];
  errorMessage: string | null;
}

/** Processing state for transcript analysis */
export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

/** Export format options */
export type ExportFormat = 'csv' | 'json' | 'markdown';

/** Toast notification types */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Toast notification */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
