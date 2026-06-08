import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { testGenerationSchema } from "../schemas/testGenerationSchema";
import { CodeContext } from "../types/CodeContext";

export interface RepairTestAgentInput {
  context: CodeContext;
  testCode: string;
  testOutput: string;
}

export async function repairTestAgent({
  context,
  testCode,
  testOutput,
}: RepairTestAgentInput) {
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: testGenerationSchema,
    }),

    system: `
You are a Senior Frontend Engineer specialized in fixing failing React tests.

You receive:
- the full Code Context
- the generated test code
- the test runner output

Your job is to fix the test code so it is more likely to pass.

Rules:
- Return only valid test code in testCode.
- Do not change production code.
- Do not remove meaningful tests just to make the suite pass.
- Prefer fixing missing providers, imports, mocks and setup.
- Use the existing test files in Code Context as source of truth.
- Do not invent local imports.
- If a local import path is unknown, add a warning instead of inventing it.
- Keep the same testing framework style.
- Avoid implementation details and fragile assertions.
- Make the smallest possible change to fix the current failure.
- Do not rewrite the entire test file unless absolutely necessary.
- Prefer removing fragile assertions over adding new setup.
- If an assertion fails because an attribute is missing, remove or replace only that assertion.
- If the error is missing ThemeProvider/theme, use the existing test file setup as source of truth.
- Do not introduce new local import paths that are not present in Code Context or Existing Test File.
- If a complex interaction test keeps failing and other tests pass, remove that single failing test instead of repeatedly rewriting the whole file.
- If a complex interaction test still fails after a repair attempt, remove that single failing test and add a warning explaining that it was removed because the DOM behavior was ambiguous.
  If a role-based query fails but the DOM output clearly shows the target text, replace only that failing query with a text-based query such as getByText or findByText.
  Do not rewrite unrelated tests.

  Do not add explanatory comments inside the test code.
  Generate at most 5 high-value tests.
  Prefer behavior/output assertions over style assertions.
  Do not test visual selected state unless it changes accessible state.

`,

    prompt: `
Code Context:

${JSON.stringify(context, null, 2)}

Failing Test Code:

\`\`\`tsx
${testCode}
\`\`\`

Test Runner Output:

\`\`\`txt
${testOutput}
\`\`\`

Fix the test code.
`,
  });

  return result.output;
}