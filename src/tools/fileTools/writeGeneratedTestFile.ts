import fs from "node:fs";
import path from "node:path";

export interface WriteGeneratedTestFileInput {
  sourceFilePath: string;
  testCode: string;
}

export interface WriteGeneratedTestFileResult {
  filePath: string;
}

export function writeGeneratedTestFile({
  sourceFilePath,
  testCode,
}: WriteGeneratedTestFileInput): WriteGeneratedTestFileResult {
  const directory = path.dirname(sourceFilePath);
  const extension = path.extname(sourceFilePath);
  const componentName = path.basename(directory);

  const testFilePath = path.join(
    directory,
    `${componentName}.generated.test${extension}`
  );

  fs.writeFileSync(testFilePath, testCode, "utf-8");

  return {
    filePath: testFilePath,
  };
}