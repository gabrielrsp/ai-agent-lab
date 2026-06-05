import fs from "node:fs";
import path from "node:path";

export function readRelatedFiles(filePath: string) {
  const directory = path.dirname(filePath);
  const directoryFiles = fs.readdirSync(directory);

  const testFiles = directoryFiles.filter(
    (file) =>
      file.endsWith(".test.ts") ||
      file.endsWith(".test.tsx") ||
      file.endsWith(".spec.ts") ||
      file.endsWith(".spec.tsx")
  );

  const staticCandidates = [
    "styles.ts",
    "styles.tsx",
    "style.ts",
    "style.tsx",
    "types.ts",
    "types.tsx",
  ];
  
  const candidates = [
    ...staticCandidates,
    ...testFiles,
  ];

  const files: { fileName: string; content: string }[] = [];

  for (const candidate of candidates) {
    const fullPath = path.join(directory, candidate);

    if (fs.existsSync(fullPath)) {
      files.push({
        fileName: candidate,
        content: fs.readFileSync(fullPath, "utf-8"),
      });
    }
  }

  return files;
}