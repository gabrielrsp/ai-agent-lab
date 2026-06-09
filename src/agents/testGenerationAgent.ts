import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { testGenerationSchema } from "../schemas/testGenerationSchema";
import { detectTestFramework } from "../tools/contextTools/detectTestFramework";
import { findExistingTestFile } from "../context/findExistingTestFile";
import { CodeContext } from "../types/CodeContext";
import { testGenerationSystemPrompt } from "../prompts/testGenerationSystemPrompt";

export async function testGenerationAgent(
  context: CodeContext
) {
    const existingTestFile = findExistingTestFile([
        ...context.relatedFiles,
        ...context.resolvedImports,
      ]);

      const testFramework = detectTestFramework(
        context.mainFile.filePath
      );

    
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: testGenerationSchema,
    }),

    system: testGenerationSystemPrompt,

    prompt: `
    Test Framework Info:
    ${JSON.stringify(testFramework, null, 2)}
    
    Existing Test File:
    ${existingTestFile ? JSON.stringify(existingTestFile, null, 2) : "null"}
    
    Code Context:
    ${JSON.stringify(context, null, 2)}
    
    Generate a test file for the main component.
    `,
  });

  return result.output;
}