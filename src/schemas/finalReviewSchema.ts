import { z } from "zod";

export const finalReviewSchema = z.object({
  summary: z.string(),
  issues: z.array(z.string()),
  risks: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type FinalReview = z.infer<typeof finalReviewSchema>;