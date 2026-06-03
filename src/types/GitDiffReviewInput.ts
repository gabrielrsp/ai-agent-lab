import { CodeContext } from "./CodeContext";
import { GitDiffResult } from "../tools/contextTools/readGitDiff";

export interface GitDiffReviewInput {
  gitDiff: GitDiffResult;
  contexts: CodeContext[];
}