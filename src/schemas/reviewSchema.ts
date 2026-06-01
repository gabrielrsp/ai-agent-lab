import { z } from "zod";

export const reviewSchema = z.object({
  summary: z.string(),
  issues: z.array(z.string()),
  risks: z.array(z.string()),
  suggestions: z.array(z.string()),
  toolInsights: z.array(
    z.object({
      toolName: z.string(),
      finding: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
});

export type ReviewResult = z.infer<typeof reviewSchema>;