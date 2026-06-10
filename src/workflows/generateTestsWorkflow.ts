import { repairTestAgent } from "../agents/repairTestAgent";
import { testGenerationAgent } from "../agents/testGenerationAgent";
import { detectTestFramework } from "../tools/contextTools/detectTestFramework";
import { writeGeneratedTestFile } from "../tools/fileTools/writeGeneratedTestFile";
import { buildTestCommand } from "../tools/testTools/buildTestCommand";
import { runTests } from "../tools/testTools/runTests";
import { CodeContext } from "../types/CodeContext";

export async function generateTestsWorkflow(context: CodeContext) {
  const maxAttempts = 3;

  const generation = await testGenerationAgent(context);

  let currentTestCode = generation.testCode;
  let attempts = 0;

  const { filePath: testFilePath } = writeGeneratedTestFile({
    sourceFilePath: context.mainFile.filePath,
    testCode: currentTestCode,
  });

  const testFramework = detectTestFramework(context.mainFile.filePath);

  const { command } = buildTestCommand({
    testRunner: testFramework.testRunner,
    testFilePath,
  });

  let testResult = runTests({
    command,
    cwd: "/Users/gabriel/projetos/dws-blog",
  });

  const repairs: Awaited<ReturnType<typeof repairTestAgent>>[] = [];

  while (!testResult.success && attempts < maxAttempts) {
    attempts++;

    console.log(`REPAIR ATTEMPT ${attempts}`);

    const repair = await repairTestAgent({
      context,
      testCode: currentTestCode,
      testOutput: testResult.output,
    });

    repairs.push(repair);

    currentTestCode = repair.testCode;

    writeGeneratedTestFile({
      sourceFilePath: context.mainFile.filePath,
      testCode: currentTestCode,
    });

    testResult = runTests({
      command,
      cwd: "/Users/gabriel/projetos/dws-blog",
    });
  }

  return {
    generation,
    repairs,
    execution: {
      attempts,
      finalSuccess: testResult.success,
      testFilePath,
      command,
      finalTestCode: currentTestCode,
      testResult,
    },
  };
}