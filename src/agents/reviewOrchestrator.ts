import { CodeContext } from "../types/CodeContext";
import { ReviewResult } from "../types/ReviewResult";

import { typescriptReviewer } from "./typescriptReviewer";
import { accessibilityReviewer } from "./accessibilityReviewer";
import { finalReviewAgent } from "./finalReviewAgent";

export interface ReviewOrchestratorResult {
  specialists: {
    typescript: ReviewResult;
    accessibility: ReviewResult;
  };
  final: Awaited<ReturnType<typeof finalReviewAgent>>;
}

export async function reviewOrchestrator(
  context: CodeContext
): Promise<ReviewOrchestratorResult> {
  const typescript = await typescriptReviewer(context);
  const accessibility = await accessibilityReviewer(context);

  const final = await finalReviewAgent({
    typescript,
    accessibility,
  });

  return {
    specialists: {
      typescript,
      accessibility,
    },
    final,
  };
}