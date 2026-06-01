import { generateText, Output, stepCountIs } from "ai";
import { openrouter } from "../providers/openRouter";
import { buildContext } from "../context/buildContext";
import { checkTypesAgentTool } from "../tools/analysisTools/checkTypesAgentTool";
import { checkAccessibilityAgentTool } from "../tools/analysisTools/checkAccessibilityAgentTool";
import { reviewSchema } from "../schemas/reviewSchema";


export async function reviewReactComponent(code: string, filePath: string) {
 
  const context = buildContext(
    filePath,
    code
  );


  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),


    output: Output.object({
      schema: reviewSchema,
    }),

    tools: {
      checkTypes: checkTypesAgentTool,
      checkAccessibility: checkAccessibilityAgentTool,
    },

    toolChoice: "auto",

    stopWhen: stepCountIs(5),


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
      You are reviewing a React component.
      
      First, use the available tools to check:
      - TypeScript typing
      - Accessibility
      
      After receiving the tool results, write the final structured review.
      
      Include in toolInsights the main findings derived from the tool calls.
      
      Context:
      
      ${JSON.stringify(context, null, 2)}
      
      Component code:
      
      \`\`\`tsx
      ${code}
      \`\`\`
      `,
  });


  return result.output;
}