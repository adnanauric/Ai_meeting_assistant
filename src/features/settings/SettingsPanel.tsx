/* ──────────────────────────────────────────────
   Settings Panel Component
   AI server configuration
   ────────────────────────────────────────────── */

import { useCallback, useState } from 'react';
import {
  Settings,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
  Info,
  Zap,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { testConnection, fetchModels } from '../../lib/ai-client';
import './settings.css';

export function SettingsPanel() {
  const settings = useSettingsStore();
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    settings.setConnectionStatus('connecting');
    settings.setErrorMessage(null);

    const result = await testConnection(settings.serverUrl, settings.apiFormat);

    if (result.success) {
      try {
        const models = await fetchModels(settings.serverUrl, settings.apiFormat);
        settings.setAvailableModels(models);
        settings.setConnectionStatus('connected');

        // Auto-select first model if none selected
        if (!settings.model && models.length > 0) {
          settings.setModel(models[0]);
        }
      } catch (error) {
        settings.setConnectionStatus('error');
        settings.setErrorMessage(
          error instanceof Error ? error.message : 'Failed to fetch models'
        );
      }
    } else {
      settings.setConnectionStatus('error');
      settings.setErrorMessage(result.message);
    }

    setIsTesting(false);
  }, [settings]);

  const statusIcon = () => {
    switch (settings.connectionStatus) {
      case 'connected':
        return <Wifi size={14} />;
      case 'connecting':
        return <Loader2 size={14} className="spinner-inline" />;
      case 'error':
        return <AlertCircle size={14} />;
      default:
        return <WifiOff size={14} />;
    }
  };

  const statusText = () => {
    switch (settings.connectionStatus) {
      case 'connected':
        return `Connected — ${settings.availableModels.length} model(s) available`;
      case 'connecting':
        return 'Testing connection…';
      case 'error':
        return settings.errorMessage || 'Connection failed';
      default:
        return 'Not connected';
    }
  };

  return (
    <div className="settings-section">
      <h2>
        <Settings size={20} />
        AI Settings
      </h2>

      <div className="settings-card">
        {/* Connection Status */}
        <div
          className={`connection-status connection-status-${settings.connectionStatus}`}
          id="connection-status"
        >
          <span className={`status-dot status-dot-${settings.connectionStatus}`} />
          {statusIcon()}
          <span>{statusText()}</span>
        </div>

        {/* API Format */}
        <div className="form-group">
          <label className="label" htmlFor="api-format">API Format</label>
          <select
            id="api-format"
            className="select"
            value={settings.apiFormat}
            onChange={(e) =>
              settings.setApiFormat(e.target.value as 'ollama' | 'openai')
            }
          >
            <option value="ollama">Ollama (Default)</option>
            <option value="openai">OpenAI-Compatible (LM Studio, etc.)</option>
          </select>
          <p className="form-hint">
            {settings.apiFormat === 'ollama'
              ? 'Default: http://localhost:11434'
              : 'Default: http://localhost:1234'}
          </p>
        </div>

        {/* Server URL */}
        <div className="form-group">
          <label className="label" htmlFor="server-url">Server URL</label>
          <div className="server-url-row">
            <input
              id="server-url"
              className="input"
              type="text"
              placeholder={
                settings.apiFormat === 'ollama'
                  ? 'http://localhost:11434'
                  : 'http://localhost:1234'
              }
              value={settings.serverUrl}
              onChange={(e) => settings.setServerUrl(e.target.value)}
            />
            <button
              id="test-connection-btn"
              className="btn btn-secondary"
              onClick={handleTestConnection}
              disabled={isTesting || !settings.serverUrl}
            >
              {isTesting ? (
                <span className="spinner spinner-sm" />
              ) : (
                <Zap size={14} />
              )}
              Test
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="form-group">
          <label className="label" htmlFor="model-select">Model</label>
          {settings.availableModels.length > 0 ? (
            <select
              id="model-select"
              className="select"
              value={settings.model}
              onChange={(e) => settings.setModel(e.target.value)}
            >
              {settings.availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <select id="model-select" className="select" disabled>
              <option>Connect to server to load models</option>
            </select>
          )}
        </div>

        {/* Temperature */}
        <div className="form-group">
          <label className="label">
            Temperature
          </label>
          <div className="slider-container">
            <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
              Precise
            </span>
            <input
              id="temperature-slider"
              type="range"
              className="slider"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => settings.setTemperature(parseFloat(e.target.value))}
            />
            <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
              Creative
            </span>
            <span className="slider-value">{settings.temperature.toFixed(2)}</span>
          </div>
          <p className="form-hint">
            Lower values produce more consistent extractions. Recommended: 0.1–0.3
          </p>
        </div>

        {/* Info box */}
        <div className="settings-info">
          <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Your transcript is sent only to the local server above. No data leaves your machine.
          </span>
        </div>
      </div>
    </div>
  );
}
