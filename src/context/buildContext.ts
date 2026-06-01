import { CodeContext } from "../types/CodeContext";
import { readRelatedFiles } from "../tools/contextTools/readRelatedFiles";
import { resolveImports } from "../tools/contextTools/resolveImports";

export function buildContext(
  filePath: string,
  code: string
): CodeContext {
  const relatedFiles = readRelatedFiles(filePath);
  const resolvedImports = resolveImports(filePath, code);

  return {
    mainFile: {
      filePath,
      content: code,
    },
    relatedFiles,
    resolvedImports,
  };
}