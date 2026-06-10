import { reviewOrchestrator } from "../agents/reviewOrchestrator";
import { CodeContext } from "../types/CodeContext";

export async function reviewWorkflow(context: CodeContext) {
  const review = await reviewOrchestrator(context);

  return {
    review,
  };
}