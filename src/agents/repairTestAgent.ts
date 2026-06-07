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