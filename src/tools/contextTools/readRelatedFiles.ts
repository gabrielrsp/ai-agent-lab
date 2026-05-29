import fs from "node:fs";
import path from "node:path";

export function readRelatedFiles(filePath: string) {
  const directory = path.dirname(filePath);

  const candidates = [
    "styles.ts",
    "styles.tsx",
    "style.ts",
    "types.ts",
    "types.tsx",
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