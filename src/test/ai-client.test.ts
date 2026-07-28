/* ──────────────────────────────────────────────
   Tests — AI Client (with fetch mocking)
   ────────────────────────────────────────────── */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { testConnection, fetchModels } from '../lib/ai-client';

// Mock global fetch
const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('testConnection', () => {
  it('returns success for a valid Ollama server', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: [] }),
    });

    const result = await testConnection('http://localhost:11434', 'ollama');
    expect(result.success).toBe(true);
    expect(result.message).toContain('Connected');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/tags',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('returns success for a valid OpenAI-compatible server', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const result = await testConnection('http://localhost:1234', 'openai');
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:1234/v1/models',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('returns failure for a non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await testConnection('http://localhost:11434', 'ollama');
    expect(result.success).toBe(false);
    expect(result.message).toContain('404');
  });

  it('returns failure for a network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const result = await testConnection('http://localhost:11434', 'ollama');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Connection refused');
  });

  it('normalizes trailing slashes in URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await testConnection('http://localhost:11434/', 'ollama');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/tags',
      expect.anything()
    );
  });
});

describe('fetchModels', () => {
  it('fetches Ollama models', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        models: [
          { name: 'llama3.2:latest' },
          { name: 'mistral:latest' },
        ],
      }),
    });

    const models = await fetchModels('http://localhost:11434', 'ollama');
    expect(models).toEqual(['llama3.2:latest', 'mistral:latest']);
  });

  it('fetches OpenAI-compatible models', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 'local-model-1' },
          { id: 'local-model-2' },
        ],
      }),
    });

    const models = await fetchModels('http://localhost:1234', 'openai');
    expect(models).toEqual(['local-model-1', 'local-model-2']);
  });

  it('throws on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Service Unavailable',
    });

    await expect(
      fetchModels('http://localhost:11434', 'ollama')
    ).rejects.toThrow('Failed to fetch models');
  });

  it('handles empty model list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: [] }),
    });

    const models = await fetchModels('http://localhost:11434', 'ollama');
    expect(models).toEqual([]);
  });
});
