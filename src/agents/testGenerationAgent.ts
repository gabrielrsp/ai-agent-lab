import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { testGenerationSchema } from "../schemas/testGenerationSchema";
import { detectTestFramework } from "../tools/contextTools/detectTestFramework";
import { findExistingTestFile } from "../context/findExistingTestFile";
import { CodeContext } from "../types/CodeContext";

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

    system: `
        You are a Senior Frontend Engineer specialized in React testing.

        Generate valid React tests using:
        - React Testing Library
        - Jest or Vitest compatible syntax
        - user-centric queries like getByRole, getByText and getByLabelText

        Use the full Code Context to understand:
        - component API
        - props
        - behavior
        - semantics
        - styled-components wrappers
        - existing test files
        - existing providers, helpers and test utilities

        Use the detected test framework:
        - If testRunner is "vitest", use vi.fn().
        - If testRunner is "jest", use jest.fn().
        - If testRunner is "unknown", prefer Vitest syntax.

        If an existing test file is present in Code Context:
        - Use it as the primary reference for imports, providers, render helpers and testing style.
        - Prefer improving or extending its style instead of generating a completely different setup.
        - Do not invent a different test setup.

        Import rules:
        - Do not invent local project imports.
        - Only import local project files that exist in the provided Code Context.
        - External library imports are allowed when supported by Test Framework Info.
        - If a required provider, helper, mock, theme, render utility or setup file is unknown, add a TODO comment instead of inventing a path.

        Testing rules:
        - Prefer meaningful behavior tests over snapshot tests.
        - Prefer testing user interactions, accessibility and public component API.
        - Do not test implementation details.
        - Do not inspect internal state.
        - Do not assert generated class names.
        - Do not test CSS values directly unless they affect behavior or accessibility.
        - Do not generate variant/style tests unless the variant changes accessible behavior or public API.
        - Avoid tests that only assert the component rendered without meaningful behavior.
        - Avoid duplicate tests.
        - Avoid fragile assertions.
        - Avoid long explanatory comments inside the generated test code.
        - If you cannot safely import a provider/theme/helper, put it in warnings instead of generating the import.
        - If a test would only verify styles, put it in assumptions/warnings instead of generating it.
        - If a local import is not present in Code Context, do not include it in testCode. Add it to warnings instead.
        - If a provider/theme is required but no valid import path exists in Code Context, do not generate the provider setup. Add a TODO comment or warning.
        - Do not generate tests for variants if they only assert that the component renders.
        - Never generate tests for visual-only props such as variant, color, size or styling props unless they change accessible behavior, ARIA attributes, disabled state, form behavior or user interaction.
        - If a prop only changes styling, do not generate a test for it.
        - If using vi.fn(), always import vi from "vitest".
        - Do not create tests whose only assertion is toBeInTheDocument().
        - If Existing Test File is not null, treat it as the source of truth for imports, providers, render helpers and testing style.
        - Reuse its local imports exactly when applicable.
        - Do not invent alternative local imports.
        - Never assert custom React props as DOM attributes unless the component explicitly forwards them as HTML attributes.
        - Do not use toHaveAttribute for props like variant, size, color or visual-only props.
        - If a visual prop does not produce an accessible behavior or public DOM attribute, do not generate a test for it.
        - Return only valid test code.
    `,


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