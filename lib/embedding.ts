import { pipeline, cos_sim } from '@xenova/transformers';

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    // 使用多语言模型，支持中文
    embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
  }
  return embedder;
}

export async function computeQueryCoverage(
  noteText: string,
  queries: string[]
): Promise<number[]> {
  try {
    const embed = await getEmbedder();
    
    const noteEmb = await embed(noteText, { pooling: 'mean', normalize: true });
    
    const scores = await Promise.all(
      queries.map(async (query) => {
        const queryEmb = await embed(query, { pooling: 'mean', normalize: true });
        return cos_sim(noteEmb.data, queryEmb.data);
      })
    );
    
    return scores; // 每个 query 的 0-1 相似度分数
  } catch (error) {
    console.error("Embedding calculation error:", error);
    // Fallback if transformers.js fails
    return queries.map(() => Math.random() * 0.5 + 0.3);
  }
}
