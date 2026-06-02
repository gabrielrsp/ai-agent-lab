import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { ReviewResult } from "../types/ReviewResult";
import { finalReviewSchema } from "../schemas/finalReviewSchema";

interface FinalReviewAgentInput {
  typescript: ReviewResult;
  accessibility: ReviewResult;
}

export async function finalReviewAgent(input: FinalReviewAgentInput) {
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: finalReviewSchema,
    }),

    system: `
    You are a Staff Frontend Engineer responsible for consolidating specialist reviews.

    You receive multiple specialist reviews and must produce a final review for the user.

    Remove weak or low-value suggestions from the final review.
    Only include suggestions that are clearly actionable.

    Do not invent issues that are not supported by specialist reviews.
    Prioritize clarity, usefulness and practical suggestions.
    `,

        prompt: `
        Specialist reviews:

        ${JSON.stringify(input, null, 2)}

        Generate the final consolidated review.
        `,
  });

  return result.output;
}