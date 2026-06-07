export interface BuildTestCommandInput {
    testRunner: string;
    testFilePath: string;
  }
  
  export interface BuildTestCommandResult {
    command: string;
  }

  export function buildTestCommand({
    testRunner,
    testFilePath,
  }: BuildTestCommandInput): BuildTestCommandResult {
    switch (testRunner) {
      case "vitest":
        return {
          command: `npx vitest run "${testFilePath}" --watch=false`,
        };
  
      case "jest":
        return {
          command: `npx jest "${testFilePath}" --watch=false`,
        };
  
      default:
        throw new Error(
          `Unsupported test runner: ${testRunner}`
        );
    }
  }