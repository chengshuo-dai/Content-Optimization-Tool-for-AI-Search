'use client';

import { motion } from 'framer-motion';

interface QueryCoverageProps {
  queries: Array<{
    text: string;
    coverageScore: number;
  }>;
}

export default function QueryCoverage({ queries }: QueryCoverageProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-bold mb-4">用户可能的搜索词</h3>
      <div className="space-y-4">
        {queries.map((q, i) => {
          const percentage = Math.round(q.coverageScore * 100);
          
          const getColor = (p: number) => {
            if (p >= 80) return 'bg-green-score';
            if (p >= 60) return 'bg-yellow-score';
            return 'bg-red-score';
          };
          
          const getTextColor = (p: number) => {
            if (p >= 80) return 'text-green-score';
            if (p >= 60) return 'text-yellow-score';
            return 'text-red-score';
          };
          
          return (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium w-1/3 truncate" title={q.text}>
                &quot;{q.text}&quot;
              </span>
              <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${getColor(percentage)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                />
              </div>
              <span className={`text-sm font-dm-sans w-12 text-right font-bold ${getTextColor(percentage)}`}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
