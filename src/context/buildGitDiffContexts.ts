import fs from "node:fs";
import path from "node:path";

import { buildContext } from "./buildContext";
import { CodeContext } from "../types/CodeContext";

export function buildGitDiffContexts(
  changedFiles: string[]
): CodeContext[] {
  return changedFiles.flatMap((filePath) => {
    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      return [];
    }

    const code = fs.readFileSync(
      resolvedPath,
      "utf-8"
    );

    return [
      buildContext(
        resolvedPath,
        code
      ),
    ];
  });
}