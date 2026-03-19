import { AnalysisResult } from '../types';
import { callDeepseek } from './deepseek';
import { computeQueryCoverage } from './embedding';
import { ANALYSIS_PROMPT, QUERY_GENERATION_PROMPT, REWRITE_PROMPT } from './prompts';

export async function analyzeNote(noteText: string): Promise<AnalysisResult> {
  // Step 1: 并行执行 AI 分析 + Query 生成
  const [analysisRaw, queriesRaw] = await Promise.all([
    callDeepseek(ANALYSIS_PROMPT(noteText)),
    callDeepseek(QUERY_GENERATION_PROMPT(noteText)),
  ]);
  
  const cleanJson = (str: string) => {
    const match = str.match(/```json\n([\s\S]*?)\n```/);
    return match ? match[1] : str;
  };

  const analysis = JSON.parse(cleanJson(analysisRaw));
  let queries: string[] = [];
  
  try {
    const parsedQueries = JSON.parse(cleanJson(queriesRaw));
    if (Array.isArray(parsedQueries)) {
      queries = parsedQueries;
    } else if (parsedQueries.queries && Array.isArray(parsedQueries.queries)) {
      queries = parsedQueries.queries;
    } else {
      // Fallback
      queries = ["小红书推荐", "探店", "好物分享", "测评", "攻略"];
    }
  } catch (e) {
    console.error("Failed to parse queries", e);
    queries = ["小红书推荐", "探店", "好物分享", "测评", "攻略"];
  }
  
  // Step 2: 计算 Embedding 相似度（本地计算）
  const rawCoverageScores = await computeQueryCoverage(noteText, queries);
  
  // 放大分数的差异，使其更具戏剧性
  // 假设一般笔记的相似度在 0.8 左右，优化后在 0.9 左右
  const coverageScores = rawCoverageScores.map(score => {
    // 线性映射：0.7 -> 0, 0.9 -> 1.0
    const scaled = (score - 0.7) * 5; 
    return Math.max(0.15, Math.min(0.98, scaled)); // 保底 15%，最高 98%
  });
  
  // Step 3: 计算 Query 覆盖率分数（归一化到0-100）
  const queryCoverageScore = Math.round(
    (coverageScores.reduce((a, b) => a + b, 0) / coverageScores.length) * 100
  );
  
  // Step 4: 生成改写版本
  const rewriteRaw = await callDeepseek(
    REWRITE_PROMPT(noteText, analysis.readability?.issues || [], queries)
  );
  const rewrite = JSON.parse(cleanJson(rewriteRaw));
  
  // Step 5: 计算总分
  const totalScore = Math.round(
    (analysis.structureScore || 0) * 0.25 +
    (analysis.entityDensityScore || 0) * 0.25 +
    queryCoverageScore * 0.30 +
    (analysis.quotabilityScore || 0) * 0.20
  );
  
  return {
    scores: {
      total: totalScore,
      structure: analysis.structureScore || 0,
      entityDensity: analysis.entityDensityScore || 0,
      queryCoverage: queryCoverageScore,
      quotability: analysis.quotabilityScore || 0,
    },
    readability: analysis.readability || {
      hasClearConclusion: false,
      hasOpeningSummary: false,
      summarizable: false,
      issues: ["无法识别"]
    },
    queries: queries.map((q, i) => ({
      text: q,
      coverageScore: coverageScores[i] || 0,
    })),
    sentences: analysis.sentences || [],
    rewrite: {
      content: rewrite.rewrittenContent || "",
      improvements: rewrite.improvements || [],
    },
  };
}
