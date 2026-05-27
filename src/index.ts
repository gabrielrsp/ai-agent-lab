import "dotenv/config";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import { z } from "zod";


const reviewSchema = z.object({
    summary: z.string(),
  
    issues: z.array(z.string()),
  
    risks: z.array(z.string()),
  
    suggestions: z.array(z.string()),
  });


const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const componentCode = `
export function Button(props) {
  return <button {...props}>Click</button>;
}
`;

async function main() {
    const result = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      output: Output.object({ schema: reviewSchema }),
  
      system: `
  Você é um Staff Frontend Engineer especialista em:
  - React
  - TypeScript
  - Accessibility
  - Testing
  - Design Systems
  
  Retorne análises objetivas e técnicas.
  `,
  
      prompt: `
  Analise este componente React:
  
  \`\`\`tsx
  ${componentCode}
  \`\`\`
  `,
    });
  
    console.log(JSON.stringify(result.output, null, 2));
  }
  
  main().catch(console.error);