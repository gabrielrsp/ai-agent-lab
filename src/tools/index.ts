import { checkTypes } from "./analysisTools/checkTypes";
import { checkAccessibility } from "./analysisTools/checkAccessibility";
import { readRelatedFiles } from "./contextTools/readRelatedFiles"
import { resolveImports } from "./contextTools/resolveImports";

export const tools = {
  checkTypes,
  checkAccessibility,
  readRelatedFiles,
  resolveImports
};