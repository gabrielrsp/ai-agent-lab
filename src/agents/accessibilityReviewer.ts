import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { reviewerResultSchema } from "../schemas/reviewerResultSchema";
import { checkAccessibility } from "../tools/analysisTools/checkAccessibility";
import { CodeContext } from "../types/CodeContext";
import { ReviewResult } from "../types/ReviewResult";

export async function accessibilityReviewer(
  context: CodeContext
): Promise<ReviewResult> {
  const accessibilityAnalysis = checkAccessibility.execute(
    context.mainFile.content
  );

  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: reviewerResultSchema,
    }),

    system: `
You are a Senior Accessibility Engineer specialized in React components.

Review only accessibility-related concerns across the provided code context.

Focus on:
- semantic HTML
- ARIA attributes
- keyboard navigation
- screen readers
- focus states
- accessible component APIs

Ignore:
- TypeScript
- styling aesthetics
- testing
- performance

When analyzing styled-components, use the full context to determine whether custom components render native semantic elements.
`,

    prompt: `
Accessibility Analysis:

${JSON.stringify(accessibilityAnalysis, null, 2)}

Code Context:

${JSON.stringify(context, null, 2)}

Generate an accessibility review based on the analysis above and the full code context.
`,
  });

  return result.output;
}