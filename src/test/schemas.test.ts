/* ──────────────────────────────────────────────
   Tests — Zod Schema Validation
   ────────────────────────────────────────────── */

import { describe, it, expect } from 'vitest';
import { parseAIResponse, AITaskSchema, AIResponseSchema } from '../lib/schemas';

describe('AITaskSchema', () => {
  it('validates a complete task', () => {
    const result = AITaskSchema.safeParse({
      title: 'Review migration scripts',
      assignee: 'James Wilson',
      deadline: 'Thursday',
      priority: 'high',
      transcriptExcerpt: 'Can someone from QA take a look?',
      needsReview: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a task with empty title', () => {
    const result = AITaskSchema.safeParse({
      title: '',
      assignee: null,
      deadline: null,
      priority: 'medium',
      transcriptExcerpt: '',
      needsReview: false,
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional fields', () => {
    const result = AITaskSchema.safeParse({
      title: 'A valid task',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.assignee).toBeNull();
      expect(result.data.deadline).toBeNull();
      expect(result.data.priority).toBe('unspecified');
      expect(result.data.needsReview).toBe(false);
    }
  });

  it('rejects invalid priority values', () => {
    const result = AITaskSchema.safeParse({
      title: 'Test task',
      priority: 'critical',
    });
    expect(result.success).toBe(false);
  });
});

describe('AIResponseSchema', () => {
  it('validates a response with tasks array', () => {
    const result = AIResponseSchema.safeParse({
      tasks: [
        { title: 'Task 1', assignee: 'Alice', deadline: null, priority: 'high', transcriptExcerpt: 'do X', needsReview: false },
        { title: 'Task 2', assignee: null, deadline: 'Friday', priority: 'low', transcriptExcerpt: 'do Y', needsReview: true },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tasks).toHaveLength(2);
    }
  });

  it('validates an empty tasks array', () => {
    const result = AIResponseSchema.safeParse({ tasks: [] });
    expect(result.success).toBe(true);
  });
});

describe('parseAIResponse', () => {
  it('parses a valid JSON object', () => {
    const raw = JSON.stringify({
      tasks: [
        { title: 'Fix bugs', assignee: 'David', deadline: 'Monday', priority: 'high', transcriptExcerpt: 'Fix those bugs', needsReview: false },
      ],
    });
    const result = parseAIResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fix bugs');
    expect(result[0].assignee).toBe('David');
  });

  it('parses a bare JSON array', () => {
    const raw = JSON.stringify([
      { title: 'Task A', assignee: null, deadline: null, priority: 'medium', transcriptExcerpt: '', needsReview: true },
    ]);
    const result = parseAIResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Task A');
  });

  it('strips markdown code fences', () => {
    const raw = '```json\n{"tasks":[{"title":"Fenced task"}]}\n```';
    const result = parseAIResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fenced task');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseAIResponse('not json at all')).toThrow(
      'not valid JSON'
    );
  });

  it('throws on schema validation failure', () => {
    const raw = JSON.stringify({ tasks: [{ title: '' }] });
    expect(() => parseAIResponse(raw)).toThrow('validation failed');
  });
});
