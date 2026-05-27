import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


function analisarRegrasReact({ componentCode }) {
  if (!componentCode.includes("propTypes") && !componentCode.includes(":")) {
    return "Aviso local: Falta tipagem no componente.";
  }
  return "Análise local: Sem erros graves.";
}

async function run() {
  const component = `export function Button(props) { return <button {...props} /> }`;

  // 2. Você passa a função DIRETO no array de tools, sem JSON schema!
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Faça o code review deste componente React: ${component}`,
    config: {
      // O SDK faz a mágica de executar e devolver o resultado sozinho
      tools: [analisarRegrasReact], 
    },
  });

  // 3. A resposta já vem pronta e mastigada
  console.log(response.text);
}

run();