/* ──────────────────────────────────────────────
   Transcript Input Component
   Paste or upload meeting transcripts
   ────────────────────────────────────────────── */

import { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Trash2,
  BookOpen,
  Type,
  Hash,
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { extractTasks } from '../../lib/ai-client';
import { sampleTranscript } from '../../data/sample-transcript';
import './TranscriptInput.css';

export function TranscriptInput() {
  const [transcript, setTranscript] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setTasks, setProcessingStatus, setProcessingError, processingStatus } =
    useTaskStore();
  const settings = useSettingsStore();

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;

  const handleExtract = useCallback(async () => {
    if (!transcript.trim()) return;

    if (!settings.model) {
      setProcessingError('Please select an AI model in the Settings panel first.');
      return;
    }

    if (settings.connectionStatus !== 'connected') {
      setProcessingError('Please connect to an AI server in the Settings panel first.');
      return;
    }

    setProcessingStatus('processing');

    try {
      const tasks = await extractTasks(transcript, {
        serverUrl: settings.serverUrl,
        apiFormat: settings.apiFormat,
        model: settings.model,
        temperature: settings.temperature,
      });
      setTasks(tasks);
    } catch (error) {
      setProcessingError(
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    }
  }, [transcript, settings, setTasks, setProcessingStatus, setProcessingError]);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(txt|md|text)$/i)) {
        setProcessingError('Please upload a .txt or .md file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setTranscript(content);
        }
      };
      reader.readAsText(file);
    },
    [setProcessingError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const loadSample = useCallback(() => {
    setTranscript(sampleTranscript);
  }, []);

  const isProcessing = processingStatus === 'processing';

  return (
    <div className="transcript-section">
      <h2>
        <FileText size={20} />
        Meeting Transcript
      </h2>

      {/* Textarea */}
      <textarea
        id="transcript-input"
        className="textarea transcript-textarea"
        placeholder="Paste your meeting transcript here, or upload a file below..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        disabled={isProcessing}
      />

      {/* Metadata bar */}
      <div className="transcript-meta">
        <div className="transcript-meta-left">
          <span><Type size={12} /> {charCount.toLocaleString()} chars</span>
          <span><Hash size={12} /> {wordCount.toLocaleString()} words</span>
        </div>
        <div className="transcript-meta-right">
          <button
            className="btn btn-ghost btn-sm"
            onClick={loadSample}
            disabled={isProcessing}
            title="Load sample transcript"
          >
            <BookOpen size={14} />
            Load Sample
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setTranscript('')}
            disabled={!transcript || isProcessing}
            title="Clear transcript"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* File upload zone */}
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={20} />
        <span>Drop a .txt or .md file here, or click to browse</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.text"
          onChange={handleFileChange}
        />
      </div>

      {/* Extract button */}
      <div className="transcript-actions">
        <button
          id="extract-btn"
          className="btn btn-primary btn-lg"
          onClick={handleExtract}
          disabled={!transcript.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner spinner-sm" />
              Analyzing transcript…
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Extract Action Items
            </>
          )}
        </button>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="processing-overlay">
          <span className="spinner spinner-lg" />
          <span className="processing-text">
            AI is analyzing your transcript…
          </span>
          <span className="processing-subtext">
            This may take 10–60 seconds depending on your model and transcript length.
          </span>
        </div>
      )}
    </div>
  );
}
