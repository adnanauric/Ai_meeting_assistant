/* ──────────────────────────────────────────────
   AI Client — Local LLM Integration
   Supports Ollama and OpenAI-compatible APIs
   ────────────────────────────────────────────── */

import type { ApiFormat, Task } from '../types';
import { parseAIResponse } from './schemas';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { v4 as uuidv4 } from 'uuid';

/** Configuration for an AI request */
interface AIRequestConfig {
  serverUrl: string;
  apiFormat: ApiFormat;
  model: string;
  temperature: number;
}

/** Result from testing a connection */
interface ConnectionTestResult {
  success: boolean;
  message: string;
}

/** Normalize the server URL (remove trailing slash) */
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Test the connection to a local AI server.
 * Attempts to reach the models endpoint.
 */
export async function testConnection(
  serverUrl: string,
  apiFormat: ApiFormat
): Promise<ConnectionTestResult> {
  const base = normalizeUrl(serverUrl);

  try {
    const endpoint =
      apiFormat === 'ollama' ? `${base}/api/tags` : `${base}/v1/models`;

    const response = await fetch(endpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Server responded with status ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: 'Connected successfully',
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return {
        success: false,
        message: 'Connection timed out. Is the AI server running?',
      };
    }
    return {
      success: false,
      message: `Cannot connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Fetch the list of available models from the AI server.
 */
export async function fetchModels(
  serverUrl: string,
  apiFormat: ApiFormat
): Promise<string[]> {
  const base = normalizeUrl(serverUrl);

  try {
    const endpoint =
      apiFormat === 'ollama' ? `${base}/api/tags` : `${base}/v1/models`;

    const response = await fetch(endpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();

    if (apiFormat === 'ollama') {
      // Ollama returns { models: [{ name, ... }] }
      return (data.models || []).map((m: { name: string }) => m.name);
    } else {
      // OpenAI format returns { data: [{ id, ... }] }
      return (data.data || []).map((m: { id: string }) => m.id);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Failed to fetch models')) {
      throw error;
    }
    throw new Error(
      `Cannot fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Send a transcript to the local AI model and extract action items.
 * Returns validated, structured Task objects.
 *
 * PRIVACY: The transcript is sent only to the local server URL.
 * No data is logged or transmitted externally.
 */
export async function extractTasks(
  transcript: string,
  config: AIRequestConfig
): Promise<Task[]> {
  const base = normalizeUrl(config.serverUrl);
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(transcript);

  let endpoint: string;
  let body: Record<string, unknown>;

  if (config.apiFormat === 'ollama') {
    endpoint = `${base}/api/chat`;
    body = {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      options: {
        temperature: config.temperature,
      },
    };
  } else {
    endpoint = `${base}/v1/chat/completions`;
    body = {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: config.temperature,
      stream: false,
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000), // 2 min timeout for large transcripts
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`AI server error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Extract the response content based on API format
  let content: string;
  if (config.apiFormat === 'ollama') {
    content = data?.message?.content ?? '';
  } else {
    content = data?.choices?.[0]?.message?.content ?? '';
  }

  if (!content.trim()) {
    throw new Error('The AI model returned an empty response. Please try again.');
  }

  // Parse, validate, and convert to Task objects
  const aiTasks = parseAIResponse(content);

  return aiTasks.map((t) => ({
    id: uuidv4(),
    title: t.title,
    assignee: t.assignee || null,
    deadline: t.deadline || null,
    priority: t.priority,
    status: 'pending' as const,
    transcriptExcerpt: t.transcriptExcerpt,
    needsReview: t.needsReview,
    createdAt: new Date().toISOString(),
  }));
}
