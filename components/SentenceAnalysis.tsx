'use client';

import { motion } from 'framer-motion';

interface SentenceAnalysisProps {
  sentences: Array<{
    text: string;
    quotabilityScore: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  readability: {
    hasClearConclusion: boolean;
    hasOpeningSummary: boolean;
    summarizable: boolean;
    issues: string[];
  };
}

export default function SentenceAnalysis({ sentences, readability }: SentenceAnalysisProps) {
  const getScoreColor = (score: 'high' | 'medium' | 'low') => {
    switch (score) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreIcon = (score: 'high' | 'medium' | 'low') => {
    switch (score) {
      case 'high': return '🟢';
      case 'medium': return '🟡';
      case 'low': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">原始内容逐句分析</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {sentences.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl border ${getScoreColor(s.quotabilityScore)} transition-colors`}>
                <p className="text-sm leading-relaxed mb-2">{s.text}</p>
                <div className="flex items-center text-xs font-medium opacity-80">
                  <span className="mr-2">{getScoreIcon(s.quotabilityScore)}</span>
                  <span>{s.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">AI 可读性诊断</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-sm">
              <span className="mr-3 text-lg">{readability.hasClearConclusion ? '✅' : '⚠️'}</span>
              <span className={readability.hasClearConclusion ? 'text-gray-800' : 'text-red-score font-medium'}>
                {readability.hasClearConclusion ? '有明确结论' : '缺少明确结论'}
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className="mr-3 text-lg">{readability.hasOpeningSummary ? '✅' : '⚠️'}</span>
              <span className={readability.hasOpeningSummary ? 'text-gray-800' : 'text-red-score font-medium'}>
                {readability.hasOpeningSummary ? '有开头总结句' : '缺少开头总结句'}
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className="mr-3 text-lg">{readability.summarizable ? '✅' : '❌'}</span>
              <span className={readability.summarizable ? 'text-gray-800' : 'text-red-score font-medium'}>
                {readability.summarizable ? '易于被AI总结' : '难以被AI提炼总结'}
              </span>
            </li>
          </ul>

          <div className="bg-red-bg rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-primary mb-2">改进建议列表</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {readability.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
