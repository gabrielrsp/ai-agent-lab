import { z } from "zod";

export const testGenerationSchema = z.object({
  testCode: z.string(),
  assumptions: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type TestGeneration =
  z.infer<typeof testGenerationSchema>;