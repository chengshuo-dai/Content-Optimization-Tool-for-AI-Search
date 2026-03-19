export const ANALYSIS_PROMPT = (note: string) => `
你是一个专业的内容优化专家，专门研究生成式AI搜索引擎的内容引用规律。

分析以下小红书笔记，返回严格的JSON格式，不要有任何其他文字：

笔记内容：
${note}

返回格式：
{
  "readability": {
    "hasClearConclusion": boolean,
    "hasOpeningSummary": boolean,
    "summarizable": boolean,
    "issues": string[]
  },
  "sentences": [
    {
      "text": "原句",
      "quotabilityScore": "high|medium|low",
      "reason": "一句话解释"
    }
  ],
  "entityList": ["识别出的地名/品牌/数字等实体"],
  "structureScore": 0-100,
  "entityDensityScore": 0-100,
  "quotabilityScore": 0-100
}

打分标准（非常严格，要有戏剧性对比）：
- 普通的日常分享笔记（如示例），缺乏结构化信息、具体数据和明确结论，分数应在 40-60 分之间。
- 只有包含大量具体实体（地址、价格、品牌）、清晰的“总分总”结构、且每段都有明确结论的专业笔记，才能打 80 分以上。
- structureScore：没有开头总结和清晰分段的，打 40-50 分。
- entityDensityScore：通篇都是“很好吃”、“很不错”等主观形容词，缺乏具体名词的，打 30-50 分。
- quotabilityScore：AI很难直接提取出客观事实作为答案的，打 40-60 分。

判断标准：
- high引用价值：包含具体地点/品牌/数字，且有明确结论
- medium引用价值：有部分实体但结论不清晰
- low引用价值：纯主观感受，无实体，无结论
`;

export const QUERY_GENERATION_PROMPT = (note: string) => `
根据以下小红书笔记内容，生成6个用户可能会在小红书搜索框输入的真实搜索词。
要求：符合中国用户搜索习惯，2-8个字，涵盖不同搜索意图。
只返回严格的JSON格式，不要其他文字：

笔记：${note}

返回格式：
{
  "queries": ["搜索词1", "搜索词2", ...]
}
`;

export const REWRITE_PROMPT = (note: string, issues: string[], queries: string[]) => `
你是小红书内容优化专家。目标是让这篇笔记更容易被生成式AI搜索引擎引用。

原始笔记：
${note}

当前问题：
${issues.join('\n')}

需要覆盖的搜索词：
${queries.join('、')}

优化原则：
1. 第一句话要包含核心结论 + 关键地点/品牌
2. 把模糊描述替换为具体实体（地址、品牌名、价格、数字）
3. 每个推荐点用"地点+特色+适合人群"结构
4. 保持小红书口语化风格，不要变成说明书
5. 结尾加一个总结句

返回JSON格式：
{
  "rewrittenContent": "优化后的完整内容",
  "improvements": ["改动说明1", "改动说明2", ...]
}
`;
