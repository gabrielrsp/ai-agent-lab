import { generateText, Output } from "ai";

import { openrouter } from "../providers/openRouter";
import { reviewSchema } from "../schemas/reviewSchema";
import { checkTypes } from "../tools/analysisTools/checkTypes";
import { readRelatedFiles } from "../tools/contextTools/readRelatedFiles";
import { checkAccessibility } from "../tools/analysisTools/checkAccessibility";
import { ToolResult } from "../types/ToolResult";


export async function reviewReactComponent(code: string, filePath: string) {
 
  const relatedFiles = readRelatedFiles(filePath)
 
  const toolResults: ToolResult[] = [
    {
      toolName: "checkTypes",
      result: checkTypes(code),
    },
    {
      toolName: "checkAccessibility",
      result: checkAccessibility(code),
    },

  ];

  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    output: Output.object({
      schema: reviewSchema,
    }),

    system: `
Você é um Staff Frontend Engineer especialista em:
- React
- TypeScript
- Accessibility
- Testing
- Design Systems

Responda de forma objetiva e técnica.
`,

    prompt: `
Tool Results:

${JSON.stringify(toolResults, null, 2)}

Related Files:

${JSON.stringify(relatedFiles, null, 2)}


Analyze this React component:

\`\`\`tsx
${code}
\`\`\`
`,
  });

  return result.output;
}