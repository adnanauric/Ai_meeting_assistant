/* ──────────────────────────────────────────────
   Tests — TranscriptInput Component
   ────────────────────────────────────────────── */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranscriptInput } from '../features/transcript/TranscriptInput';
import { useTaskStore } from '../stores/taskStore';
import { useSettingsStore } from '../stores/settingsStore';

describe('TranscriptInput', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      processingStatus: 'idle',
      processingError: null,
    });
    useSettingsStore.setState({
      serverUrl: 'http://localhost:11434',
      apiFormat: 'ollama',
      model: 'llama3.2',
      temperature: 0.3,
      connectionStatus: 'connected',
      availableModels: ['llama3.2'],
      errorMessage: null,
    });
  });

  it('renders the textarea', () => {
    render(<TranscriptInput />);
    expect(
      screen.getByPlaceholderText(/paste your meeting transcript/i)
    ).toBeInTheDocument();
  });

  it('shows word and character count', async () => {
    const user = userEvent.setup();
    render(<TranscriptInput />);

    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i);
    await user.type(textarea, 'hello world test');

    expect(screen.getByText(/3 words/i)).toBeInTheDocument();
  });

  it('has a disabled extract button when textarea is empty', () => {
    render(<TranscriptInput />);
    const btn = screen.getByText(/extract action items/i);
    expect(btn).toBeDisabled();
  });

  it('enables extract button when transcript is entered', async () => {
    const user = userEvent.setup();
    render(<TranscriptInput />);

    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i);
    await user.type(textarea, 'Some meeting transcript content');

    const btn = screen.getByText(/extract action items/i);
    expect(btn).not.toBeDisabled();
  });

  it('loads sample transcript', async () => {
    const user = userEvent.setup();
    render(<TranscriptInput />);

    const loadBtn = screen.getByText(/load sample/i);
    await user.click(loadBtn);

    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Project Status Meeting');
  });

  it('clears transcript', async () => {
    const user = userEvent.setup();
    render(<TranscriptInput />);

    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i) as HTMLTextAreaElement;
    await user.type(textarea, 'Some text');

    const clearBtn = screen.getByText(/clear/i);
    await user.click(clearBtn);

    expect(textarea.value).toBe('');
  });
});
