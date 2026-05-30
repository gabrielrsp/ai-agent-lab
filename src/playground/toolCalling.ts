import "dotenv/config";

import { generateText, stepCountIs } from "ai";
import { openrouter } from "../providers/openRouter";
import { checkTypesAgentTool } from "../tools/analysisTools/checkTypesAgentTool";
import { checkAccessibilityAgentTool } from "../tools/analysisTools/checkAccessibilityAgentTool"

const componentCode = `
export function Button(props) {
  return <button {...props}>Click</button>;
}
`;

async function main() {
  const result = await generateText({
    model: openrouter("google/gemini-2.5-flash"),

    tools: {
      checkTypes: checkTypesAgentTool,
      checkAccessibility: checkAccessibilityAgentTool
    },

    toolChoice: "required",
    
    stopWhen: stepCountIs(5),

    prompt: `
    Review this React component.
    
    Before answering, you must use the available tools to check:
    - TypeScript typing
    - Accessibility
    
    Then write the final review using the tool results.
    
    \`\`\`tsx
    ${componentCode}
    \`\`\`
    `,
  });

  console.log("TEXT:");
  console.log(result.text);

  console.log("TOOL CALLS:");
  console.log(JSON.stringify(result.toolCalls, null, 2));

  console.log("TOOL RESULTS:");
  console.log(JSON.stringify(result.toolResults, null, 2));
}

main().catch(console.error);