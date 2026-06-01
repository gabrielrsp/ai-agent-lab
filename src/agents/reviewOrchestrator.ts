import { CodeContext } from "../types/CodeContext";
import { ReviewResult } from "../types/ReviewResult";

import { typescriptReviewer } from "./typescriptReviewer";
import { accessibilityReviewer } from "./accessibilityReviewer";

export interface ReviewOrchestratorResult {
  typescript: ReviewResult;
  accessibility: ReviewResult;
}

export async function reviewOrchestrator(
  context: CodeContext
): Promise<ReviewOrchestratorResult> {
  const typescript = await typescriptReviewer(context);
  const accessibility = await accessibilityReviewer(context);

  return {
    typescript,
    accessibility,
  };
}