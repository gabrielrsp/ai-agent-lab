import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import { buildContext } from "../context/buildContext";
import { engineeringRouter } from "../workflows/engineeringRouter";

async function main() {
  const filePath = path.resolve(
    "/Users/gabriel/projetos/dws-blog/src/components/Sidebar/index.tsx"
  );

  const code = fs.readFileSync(filePath, "utf-8");

  const context = buildContext(filePath, code);

  const result = await engineeringRouter({
    task: "review this component",
    context,
  });

  console.dir(result, {
    depth: null,
  });
}

main();