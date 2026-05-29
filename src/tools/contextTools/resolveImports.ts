import fs from "node:fs";
import path from "node:path";

const SUPPORTED_EXTENSIONS = [".ts", ".tsx"];

function resolveImportPath(baseFilePath: string, importPath: string) {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const baseDirectory = path.dirname(baseFilePath);
  const absoluteBasePath = path.resolve(baseDirectory, importPath);

  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = `${absoluteBasePath}${extension}`;

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  for (const extension of SUPPORTED_EXTENSIONS) {
    const indexPath = path.join(absoluteBasePath, `index${extension}`);

    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

export function resolveImports(filePath: string, code: string) {
  const importRegex = /import\s+[^'"]+['"]([^'"]+)['"]/g;

  const imports = Array.from(code.matchAll(importRegex)).map(
    (match) => match[1]
  );

  const resolvedFiles = imports
    .map((importPath) => {
      const resolvedPath = resolveImportPath(filePath, importPath);

      if (!resolvedPath) {
        return null;
      }

      return {
        importPath,
        resolvedPath,
        content: fs.readFileSync(resolvedPath, "utf-8"),
      };
    })
    .filter(Boolean);

  return resolvedFiles;
}