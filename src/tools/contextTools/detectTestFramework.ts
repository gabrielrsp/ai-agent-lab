import fs from "node:fs";
import path from "node:path";

export interface TestFrameworkInfo {
  testRunner: "jest" | "vitest" | "unknown";
  hasTestingLibrary: boolean;
  hasJestDom: boolean;
}

export function detectTestFramework(
  filePath: string
): TestFrameworkInfo {
  let currentDir = path.dirname(filePath);

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(
      currentDir,
      "package.json"
    );

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
      );

      const dependencies = {
        ...(packageJson.dependencies ?? {}),
        ...(packageJson.devDependencies ?? {}),
      };

      const hasVitest = Boolean(dependencies.vitest);
      const hasJest = Boolean(dependencies.jest);
      const hasTestingLibrary = Boolean(
        dependencies["@testing-library/react"]
      );
      const hasJestDom = Boolean(
        dependencies["@testing-library/jest-dom"]
      );

      return {
        testRunner: hasVitest
          ? "vitest"
          : hasJest
            ? "jest"
            : "unknown",
        hasTestingLibrary,
        hasJestDom,
      };
    }

    currentDir = path.dirname(currentDir);
  }

  return {
    testRunner: "unknown",
    hasTestingLibrary: false,
    hasJestDom: false,
  };
}