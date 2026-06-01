import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { accessibilityReviewer } from "./agents/accessibilityReviewer";
import { typescriptReviewer } from "./agents/typescriptReviewer";
import { buildContext } from "./context/buildContext";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error(
      "Uso: npm run review <caminho-do-arquivo.tsx>"
    );
    process.exit(1);
  }

  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(
      `Arquivo não encontrado: ${resolvedPath}`
    );
    process.exit(1);
  }

  const code = fs.readFileSync(
    resolvedPath,
    "utf-8"
  );

  const context = buildContext(
    resolvedPath,
    code
  );

  const tsReview =
    await typescriptReviewer(context);

  const a11yReview =
    await accessibilityReviewer(context);

  console.log(
    "****** TYPESCRIPT REVIEW ******"
  );
  console.log(
    JSON.stringify(tsReview, null, 2)
  );

  console.log(
    "****** ACCESSIBILITY REVIEW ******"
  );
  console.log(
    JSON.stringify(a11yReview, null, 2)
  );
}

main().catch((error) => {
  console.error(
    "Erro ao executar review:",
    error
  );

  process.exit(1);
});