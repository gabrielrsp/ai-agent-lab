import { tool } from "ai";
import { z } from "zod";

export const checkTypesAgentTool = tool({
  description:
    "Analyze React code and detect TypeScript typing.",

  inputSchema: z.object({
    code: z.string(),
  }),

  execute: async ({ code }) => {
    const hasTypes =
      code.includes("interface ") ||
      code.includes("type ");

    return {
      hasTypes,
      message: hasTypes
        ? "TypeScript typing detected."
        : "No explicit typing detected.",
    };
  },
});