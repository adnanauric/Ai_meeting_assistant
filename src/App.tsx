/* ──────────────────────────────────────────────
   App Component — Main application shell
   ────────────────────────────────────────────── */

import { BrainCircuit, ExternalLink } from 'lucide-react';
import { TranscriptInput } from './features/transcript/TranscriptInput';
import { TaskTable } from './features/tasks/TaskTable';
import { SettingsPanel } from './features/settings/SettingsPanel';
import { ToastContainer } from './components/ToastContainer';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">
            <BrainCircuit size={22} />
          </div>
          <h1>AI Meeting Assistant</h1>
        </div>
        <div className="app-header-actions">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            title="View on GitHub"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="app-layout">
        {/* Sidebar: Transcript + Settings */}
        <aside className="app-sidebar">
          <TranscriptInput />
          <hr className="divider" />
          <SettingsPanel />
        </aside>

        {/* Main Content: Task Table */}
        <main className="app-main">
          <TaskTable />
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
