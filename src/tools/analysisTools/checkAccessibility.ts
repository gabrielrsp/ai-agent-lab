import { ToolDefinition } from "./toolDefinitions";

interface CheckAccessibilityResult {
  signals: {
    hasAriaLabel: boolean;
    hasAriaDescribedBy: boolean;
    hasRole: boolean;
    hasButtonElement: boolean;
  };
  issues: string[];
  passed: boolean;
}

export const checkAccessibility: ToolDefinition<
  string,
  CheckAccessibilityResult
> = {
  name: "checkAccessibility",

  description:
    "Analyze React code and detect basic accessibility signals for button components.",

  execute(code) {
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
        "Button component does not appear to provide explicit accessibility attributes."
      );
    }

    return {
      signals,
      issues,
      passed: issues.length === 0,
    };
  },
};