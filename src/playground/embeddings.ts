import "dotenv/config";

import { semanticSearch } from "../retrieval/semanticSearch";
import { SemanticDocument } from "../retrieval/types";

async function main() {
  const documents: SemanticDocument[] = [
    {
      id: "doc-1",
      content:
        "user login flow using email and password",
    },
    {
      id: "doc-2",
      content:
        "sign in user with session token",
    },
    {
      id: "doc-3",
      content:
        "react context provider for global state",
    },
    {
      id: "doc-4",
      content:
        "1995 honda civic coupe with modified intake",
    },
    {
      id: "doc-5",
      content:
        "jwt authentication and refresh token strategy",
    },
  ];

  const results = await semanticSearch({
    query: "authentication",
    documents,
    topK: 3,
  });

  console.log("\nTOP RESULTS:\n");

  results.forEach((result) => {
    console.log(
      `${result.score.toFixed(4)} - ${result.document.id}`
    );

    console.log(result.document.content);

    console.log("---------------------");
  });
}

main();