import { generateText, stepCountIs } from "ai";

import { openrouter } from "../providers/openRouter";
import { buildContext } from "../context/buildContext";
import { checkTypesAgentTool } from "../tools/analysisTools/checkTypesAgentTool";
import { checkAccessibilityAgentTool } from "../tools/analysisTools/checkAccessibilityAgentTool";


export async function reviewReactComponent(code: string, filePath: string) {
 
  const context = buildContext(
    filePath,
    code
  );


  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

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
      
      After receiving the tool results, write the final review.
      
      Use the exact component code below as input for the tools.
      
      Context:
      
      ${JSON.stringify(context, null, 2)}
      
      Component code:
      
      \`\`\`tsx
      ${code}
      \`\`\`
      `,
  });

  console.log(
    JSON.stringify(result.steps, null, 2)
  );
  console.log(result.text);

  return result.text;
}