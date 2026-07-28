/* ──────────────────────────────────────────────
   Settings Store — AI server configuration
   Persisted to localStorage
   ────────────────────────────────────────────── */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AISettings, ApiFormat, ConnectionStatus } from '../types';

interface SettingsState extends AISettings {
  // Actions
  setServerUrl: (url: string) => void;
  setApiFormat: (format: ApiFormat) => void;
  setModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setAvailableModels: (models: string[]) => void;
  setErrorMessage: (msg: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      serverUrl: 'http://localhost:11434',
      apiFormat: 'ollama' as ApiFormat,
      model: '',
      temperature: 0.3,
      connectionStatus: 'disconnected' as ConnectionStatus,
      availableModels: [],
      errorMessage: null,

      // Actions
      setServerUrl: (url) => set({ serverUrl: url, connectionStatus: 'disconnected' }),
      setApiFormat: (format) => set({ apiFormat: format, connectionStatus: 'disconnected' }),
      setModel: (model) => set({ model }),
      setTemperature: (temp) => set({ temperature: temp }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setAvailableModels: (models) => set({ availableModels: models }),
      setErrorMessage: (msg) => set({ errorMessage: msg }),
    }),
    {
      name: 'ai-meeting-assistant-settings',
      // Only persist these fields
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        apiFormat: state.apiFormat,
        model: state.model,
        temperature: state.temperature,
      }),
    }
  )
);
