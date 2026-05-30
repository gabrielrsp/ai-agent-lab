export interface ToolDefinition<TInput, TOutput> {
    name: string;
    description: string;
    execute: (input: TInput) => TOutput;
  }