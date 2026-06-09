import "dotenv/config";
import { routerAgent } from "../agents/routerAgent";

async function main() {
  const tasks = [
    "review this component",
    "generate RTL tests for this component",
    "check this git diff",
    "fix this failing test",
    "tell me a joke",
  ];

  for (const task of tasks) {
    const result = await routerAgent(task);

    console.log("\nTASK:", task);
    console.log(result);
  }
}

main();