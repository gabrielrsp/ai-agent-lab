export interface SemanticDocument {
    id: string;
    content: string;
  }
  
  export interface SearchResult {
    document: SemanticDocument;
    score: number;
  }