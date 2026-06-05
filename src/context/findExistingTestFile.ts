import { CodeContextFile } from "../types/CodeContext";


export function findExistingTestFile(
  files: CodeContextFile[]
): CodeContextFile | null {
  return (
    files.find((file) => {
      const fileName = file.fileName ?? "";
      const filePath = file.filePath ?? file.resolvedPath ?? "";

      return (
        fileName.includes(".test.") ||
        fileName.includes(".spec.") ||
        filePath.includes(".test.") ||
        filePath.includes(".spec.")
      );
    }) ?? null
  );
}