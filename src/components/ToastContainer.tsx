/* ──────────────────────────────────────────────
   Toast Notification Container
   ────────────────────────────────────────────── */

import { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';

interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { processingStatus, processingError } = useTaskStore();

  const addToast = useCallback(
    (type: ToastItem['type'], message: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // React to processing status changes
  useEffect(() => {
    if (processingStatus === 'success') {
      addToast('success', 'Action items extracted successfully!');
    }
  }, [processingStatus, addToast]);

  useEffect(() => {
    if (processingStatus === 'error' && processingError) {
      addToast('error', processingError);
    }
  }, [processingStatus, processingError, addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            style={{ '--toast-duration': '3.5s' } as React.CSSProperties}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => removeToast(toast.id)}
              style={{ padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
