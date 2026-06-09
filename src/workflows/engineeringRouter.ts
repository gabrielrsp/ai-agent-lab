import { routerAgent } from "../agents/routerAgent";
import { testGenerationAgent } from "../agents/testGenerationAgent";
import { CodeContext } from "../types/CodeContext";
import { generateTestsWorkflow } from "./generateTestsWorkflow";

type EngineeringRouterInput = {
  task: string;
  context?: CodeContext;
};

export async function engineeringRouter({
  task,
  context,
}: EngineeringRouterInput) {
  const route = await routerAgent(task);

  console.log("ROUTE:", route);

  switch (route.intent) {
    case "generate_tests": {
      if (!context) {
        return {
          workflow: "generate_tests",
          route,
          success: false,
          error: "CodeContext is required to generate tests.",
        };
      }

      const result =  await generateTestsWorkflow(context);

      return {
        workflow: "generate_tests",
        route,
        success: true,
        result,
      };
    }

    case "review":
      return {
        workflow: "review",
        route,
        success: false,
        error: "Review workflow is not connected yet.",
      };

    case "git_diff_review":
      return {
        workflow: "git_diff_review",
        route,
        success: false,
        error: "Git diff review workflow is not connected yet.",
      };

    case "repair_tests":
      return {
        workflow: "repair_tests",
        route,
        success: false,
        error: "Repair tests workflow is not connected yet.",
      };

    default:
      return {
        workflow: "unknown",
        route,
        success: false,
        error: "Unknown or unsupported task.",
      };
  }
}