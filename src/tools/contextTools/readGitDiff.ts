import { execSync } from "node:child_process";

export interface GitDiffResult {
  changedFiles: string[];
  diff: string;
}

export function readGitDiff(): GitDiffResult {
  const changedFiles = execSync("git diff --name-only", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean);

  const diff = execSync("git diff", {
    encoding: "utf-8",
  });

  return {
    changedFiles,
    diff,
  };
}
