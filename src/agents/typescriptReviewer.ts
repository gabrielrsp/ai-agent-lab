import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { reviewerResultSchema } from "../schemas/reviewerResultSchema";
import { checkTypes } from "../tools/analysisTools/checkTypes";
import { CodeContext } from "../types/CodeContext";
import { ReviewResult } from "../types/ReviewResult";


export async function typescriptReviewer(context: CodeContext): Promise<ReviewResult> {
  const typeAnalysis = checkTypes.execute(context.mainFile.content);

  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: reviewerResultSchema,
    }),

    system: `
      You are a Senior Frontend Engineer specialized in React and TypeScript.

      Review only TypeScript-related concerns across the provided code context.

      Evaluate:
      - prop typing
      - interfaces
      - type aliases
      - generics
      - any usage
      - component API design
      - React typing best practices
      - maintainability

      Ignore:
      - accessibility
      - styling
      - testing
      - performance

      Do not suggest changes that would reduce component flexibility.

      For Design System components, prefer reusable and extensible typing patterns.
      `,

          prompt: `
      Type Analysis:

      ${JSON.stringify(typeAnalysis, null, 2)}

      Code Context:

      ${JSON.stringify(context, null, 2)}

      Generate a TypeScript review based on the analysis above and the full code context.
      `,
  });

  return result.output;
}