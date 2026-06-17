import { embedMany } from "ai";

import { openrouter } from "../providers/openRouter";
import { cosineSimilarity } from "../utils/cosineSimilarity";

import {
  SearchResult,
  SemanticDocument,
} from "./types";

export interface SemanticSearchInput {
  query: string;
  documents: SemanticDocument[];
  topK?: number;
}

export async function semanticSearch({
  query,
  documents,
  topK = 5,
}: SemanticSearchInput): Promise<SearchResult[]> {
  const values = [
    query,
    ...documents.map(
      (document) => document.content
    ),
  ];

  const result = await embedMany({
    model: openrouter.textEmbeddingModel(
      "openai/text-embedding-3-small"
    ),
    values,
  });

  const queryVector = result.embeddings[0];

  const documentVectors =
    result.embeddings.slice(1);

  return documents
    .map((document, index) => ({
      document,
      score: cosineSimilarity(
        queryVector,
        documentVectors[index]
      ),
    }))
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, topK);
}