import { z } from "zod";

export const reviewerResultSchema = z.object({
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type ReviewerResult = z.infer<
  typeof reviewerResultSchema
>;