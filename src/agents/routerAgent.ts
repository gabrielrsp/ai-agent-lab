import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { routerSchema } from "../schemas/routerSchema";

export async function routerAgent(task: string) {
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: routerSchema,
    }),

    system: `
You are a Software Engineering Router Agent.

Your job is to classify the user's request into one intent.

Possible intents:

- review: the user wants to review a React component or source file.
- generate_tests: the user wants to generate tests for a component or file.
- git_diff_review: the user wants to review changed files from git diff.
- repair_tests: the user wants to fix or repair a failing test.
- unknown: the task does not match any supported software engineering workflow.

Rules:
- Return only the best matching intent.
- Do not execute the task.
- Do not generate code for the requested task.
- Do not review code.
- Do not write tests.
- Only classify the task.
- Use "unknown" when the task is unrelated or too ambiguous.
`,

    prompt: `
User task:
${task}

Classify this task.
`,
  });

  return result.output;
}