/* ──────────────────────────────────────────────
   Zod Schemas — Validate AI model JSON responses
   ────────────────────────────────────────────── */

import { z } from 'zod';

/** Schema for a single extracted action item from the AI */
export const AITaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  assignee: z.string().nullable().default(null),
  deadline: z.string().nullable().default(null),
  priority: z.enum(['high', 'medium', 'low', 'unspecified']).default('unspecified'),
  transcriptExcerpt: z.string().default(''),
  needsReview: z.boolean().default(false),
});

/** Schema for the full AI response (array of tasks) */
export const AIResponseSchema = z.object({
  tasks: z.array(AITaskSchema),
});

/** Inferred types for the validated AI output */
export type AITaskOutput = z.infer<typeof AITaskSchema>;
export type AIResponseOutput = z.infer<typeof AIResponseSchema>;

/**
 * Parse and validate a raw JSON string from the AI model.
 * Extracts JSON from markdown code fences if present.
 * Returns validated tasks or throws with descriptive error.
 */
export function parseAIResponse(raw: string): AITaskOutput[] {
  // Strip markdown code fences if present
  let cleaned = raw.trim();

  // Handle ```json ... ``` wrapping
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'The AI response was not valid JSON. Please try again or adjust the prompt.'
    );
  }

  // Handle both { tasks: [...] } and bare [...] formats
  if (Array.isArray(parsed)) {
    parsed = { tasks: parsed };
  }

  const result = AIResponseSchema.safeParse(parsed);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`AI response validation failed: ${issues}`);
  }

  return result.data.tasks;
}
