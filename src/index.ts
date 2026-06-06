import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { reviewOrchestrator } from "./agents/reviewOrchestrator";
import { testGenerationAgent } from "./agents/testGenerationAgent";
import { buildContext } from "./context/buildContext";
import { writeGeneratedTestFile } from "./tools/fileTools/writeGeneratedTestFile";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error(
      "Uso: npm run review <caminho-do-arquivo.tsx>"
    );
    process.exit(1);
  }

  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(
      `Arquivo não encontrado: ${resolvedPath}`
    );
    process.exit(1);
  }

  const code = fs.readFileSync(
    resolvedPath,
    "utf-8"
  );

  const context = buildContext(
    resolvedPath,
    code
  );

  //const review = await reviewOrchestrator(context);
  //console.log(JSON.stringify(review, null, 2));


  const testGeneration =
  await testGenerationAgent(context);

  console.log("****** TEST GENERATION ******");
  console.log(testGeneration.testCode);
  console.log("ASSUMPTIONS:", testGeneration.assumptions);
  console.log("WARNINGS:", testGeneration.warnings);


  const writtenFile = writeGeneratedTestFile({
    sourceFilePath: resolvedPath,
    testCode: testGeneration.testCode,
  });
  
  console.log("Generated test file:");
  console.log(writtenFile.filePath);

}

main().catch((error) => {
  console.error(
    "Erro ao executar review:",
    error
  );

  process.exit(1);
});