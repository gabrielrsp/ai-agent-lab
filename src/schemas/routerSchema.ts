import { z } from "zod";

export const routerSchema = z.object({
  intent: z.enum([
    "review",
    "generate_tests",
    "git_diff_review",
    "repair_tests",
    "unknown",
  ]),
  reason: z.string(),
});

export type RouterResult = z.infer<typeof routerSchema>;