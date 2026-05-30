import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { reviewReactComponent } from "./agents/reviewReactComponent";

async function main() {

  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Uso: npm run review <caminho-do-arquivo.tsx>");
    process.exit(1);
  }

  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Arquivo não encontrado: ${resolvedPath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(resolvedPath, "utf-8");

  const review = await reviewReactComponent(code, resolvedPath);

  console.log("Review", review);
}


main().catch((error) => {
  console.error("Erro ao executar review:", error);
  process.exit(1);
});