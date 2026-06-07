import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { reviewOrchestrator } from "./agents/reviewOrchestrator";
import { testGenerationAgent } from "./agents/testGenerationAgent";
import { buildContext } from "./context/buildContext";
import { writeGeneratedTestFile } from "./tools/fileTools/writeGeneratedTestFile";
import { detectTestFramework } from "./tools/contextTools/detectTestFramework";
import { buildTestCommand } from "./tools/testTools/buildTestCommand";
import { runTests } from "./tools/testTools/runTests";
import { repairTestAgent } from "./agents/repairTestAgent";

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


  const testGeneration = await testGenerationAgent(context);

  console.log("****** TEST GENERATION ******");
  console.log(testGeneration.testCode);
  console.log("ASSUMPTIONS:", testGeneration.assumptions);
  console.log("WARNINGS:", testGeneration.warnings);


  const writtenFile = writeGeneratedTestFile({
    sourceFilePath: resolvedPath,
    testCode: testGeneration.testCode,
  });
  

  const testFramework =
  detectTestFramework(resolvedPath);

  const testCommand =
  buildTestCommand({
    testRunner:
      testFramework.testRunner,
    testFilePath:
      writtenFile.filePath,
  });

  const testResult =
  runTests({
    command:
      testCommand.command,
    cwd:
      "/Users/gabriel/projetos/dws-blog",
  });


  console.log(
    JSON.stringify(testResult, null, 2)
  );



  if (!testResult.success) {
    const repaired =
      await repairTestAgent({
        context,
        testCode: testGeneration.testCode,
        testOutput: testResult.output,
      });
  
    writeGeneratedTestFile({
      sourceFilePath: resolvedPath,
      testCode: repaired.testCode,
    });
  }
  

}

main().catch((error) => {
  console.error(
    "Erro ao executar review:",
    error
  );

  process.exit(1);
});

