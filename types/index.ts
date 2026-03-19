export interface AnalysisResult {
  scores: {
    total: number;           // 0-100
    structure: number;       // 结构清晰度
    entityDensity: number;   // 实体密度
    queryCoverage: number;   // Query覆盖率
    quotability: number;     // 可引用性
  };
  readability: {
    hasClearConclusion: boolean;
    hasOpeningSummary: boolean;
    summarizable: boolean;
    issues: string[];
  };
  queries: Array<{
    text: string;
    coverageScore: number;   // 0-1，embedding cosine similarity
  }>;
  sentences: Array<{
    text: string;
    quotabilityScore: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  rewrite: {
    content: string;
    improvements: string[];
  };
}
