import path from "node:path";
import { testGenerationAgent } from "../agents/testGenerationAgent";
import { detectTestFramework } from "../tools/contextTools/detectTestFramework";
import { writeGeneratedTestFile } from "../tools/fileTools/writeGeneratedTestFile";
import { buildTestCommand } from "../tools/testTools/buildTestCommand";
import { runTests } from "../tools/testTools/runTests";
import { CodeContext } from "../types/CodeContext";

export async function generateTestsWorkflow(context: CodeContext) {

  const targetProjectRoot = "/Users/gabriel/projetos/dws-blog";
  const generation = await testGenerationAgent(context);

  const { filePath: testFilePath } = writeGeneratedTestFile({
    sourceFilePath: context.mainFile.filePath,
    testCode: generation.testCode,
  });

  const testFramework = detectTestFramework(
    context.mainFile.filePath
  );

  const { command } = buildTestCommand({
    testRunner: testFramework.testRunner,
    testFilePath,
  });

  const testResult = runTests({
    command,
    cwd: targetProjectRoot,
  });

  return {
    generation,
  
    execution: {
      testFilePath,
      command,
      testResult,
    },
  };
  

}