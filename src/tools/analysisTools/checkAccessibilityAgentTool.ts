import { tool } from "ai";
import { z } from "zod";

export const checkAccessibilityAgentTool = tool({
  description:
    "Analyze React code and detect basic accessibility issues.",

  inputSchema: z.object({
    code: z.string(),
  }),

  execute: async ({ code }) => {
    const signals = {
      hasAriaLabel: code.includes("aria-label"),
      hasAriaDescribedBy: code.includes("aria-describedby"),
      hasRole: code.includes("role="),
      hasButtonElement: code.includes("<button"),
    };

    const issues: string[] = [];

    if (
      signals.hasButtonElement &&
      !signals.hasAriaLabel &&
      !signals.hasAriaDescribedBy
    ) {
      issues.push(
        "Button does not expose explicit accessibility attributes."
      );
    }

    return {
      signals,
      issues,
      passed: issues.length === 0,
    };
  },
});