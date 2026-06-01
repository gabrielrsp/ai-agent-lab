import fs from "node:fs";
import path from "node:path";
import { CodeContextFile } from "../../types/CodeContext";

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

export function resolveImports(
  filePath: string,
  code: string
): CodeContextFile[] {
  const importRegex = /import\s+[^'"]+['"]([^'"]+)['"]/g;

  const imports = Array.from(code.matchAll(importRegex)).map(
    (match) => match[1]
  );

  return imports.reduce<CodeContextFile[]>((acc, importPath) => {
    const resolvedPath = resolveImportPath(filePath, importPath);

    if (!resolvedPath) {
      return acc;
    }

    acc.push({
      importPath,
      resolvedPath,
      content: fs.readFileSync(resolvedPath, "utf-8"),
    });

    return acc;
  }, []);
}