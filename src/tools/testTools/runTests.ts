import { execSync } from "node:child_process";

export interface RunTestsResult {
  success: boolean;
  output: string;
}

export interface RunTestsInput {
    command: string;
    cwd: string;
  }

  export function runTests({
    command,
    cwd,
  }: RunTestsInput): RunTestsResult {
  try {
    const output = execSync(command, {
      encoding: "utf-8",
      cwd
    });

    return {
      success: true,
      output,
    };
  } catch (error: any) {
    return {
      success: false,
      output: [
        error?.stdout?.toString(),
        error?.stderr?.toString(),
        error?.message,
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }
}