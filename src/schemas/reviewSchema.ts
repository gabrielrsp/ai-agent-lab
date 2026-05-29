import { z } from "zod";

export const reviewSchema = z.object({
  summary: z.string(),
  issues: z.array(z.string()),
  risks: z.array(z.string()),
  suggestions: z.array(z.string()),
  toolResults: z.array(
    z.object({
      toolName: z.string(),
      result: z.string(),
    })
  ),
});

export type ReviewResult = z.infer<typeof reviewSchema>;