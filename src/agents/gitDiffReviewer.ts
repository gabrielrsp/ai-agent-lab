import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { reviewerResultSchema } from "../schemas/reviewerResultSchema";
import { ReviewResult } from "../types/ReviewResult";
import { GitDiffReviewInput } from "../types/GitDiffReviewInput";

export async function gitDiffReviewer(
  input: GitDiffReviewInput
): Promise<ReviewResult> {
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: reviewerResultSchema,
    }),

    system: `
        You are a Senior Frontend Engineer reviewing a git diff.

        Focus only on the changes introduced in the diff.

        Only report issues introduced or directly affected by the diff.
        If you notice pre-existing problems, mention them only as low-priority notes.

        Look for:
        - bugs
        - regressions
        - maintainability issues
        - TypeScript issues
        - React issues
        - package/config mistakes

        Ignore unrelated code that was not changed.
        Be concise and practical.

        Only provide suggestions that are directly supported by the diff or the provided code context.

        Do not suggest new tools, libraries or architectural changes unless they are clearly justified by the changes being reviewed.
        `,

        prompt: `
          Changed files:
          
          ${JSON.stringify(input.gitDiff.changedFiles, null, 2)}
          
          Git diff:
          
          \`\`\`diff
          ${input.gitDiff.diff}
          \`\`\`
          
          Code Contexts:
          
          ${JSON.stringify(input.contexts, null, 2)}
          
          Generate a review for this diff using both the diff and the provided code contexts.
        `,
  });

  return result.output;
}