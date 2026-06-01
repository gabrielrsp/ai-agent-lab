export interface CodeContextFile {
  fileName?: string;
  filePath?: string;
  importPath?: string;
  resolvedPath?: string;
  content: string;
}

export interface CodeContext {
  mainFile: {
    filePath: string;
    content: string;
  };
  relatedFiles: CodeContextFile[];
  resolvedImports: CodeContextFile[];
}