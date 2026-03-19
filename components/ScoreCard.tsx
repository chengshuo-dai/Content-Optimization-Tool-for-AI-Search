'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreCardProps {
  scores: {
    total: number;
    structure: number;
    entityDensity: number;
    queryCoverage: number;
    quotability: number;
  };
}

function CircularProgress({ value, size = 120, strokeWidth = 8, colorClass = "text-red-primary" }: { value: number, size?: number, strokeWidth?: number, colorClass?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-bold font-dm-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="text-xs text-gray-500">/100</span>
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string, value: number }) {
  const getColor = (v: number) => {
    if (v >= 80) return "text-green-score";
    if (v >= 60) return "text-yellow-score";
    return "text-red-score";
  };

  return (
    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
      <span className="text-xs text-gray-600 mb-1 whitespace-nowrap">{label}</span>
      <span className={`text-lg font-bold font-dm-sans ${getColor(value)}`}>{value}</span>
    </div>
  );
}

export default function ScoreCard({ scores }: ScoreCardProps) {
  const getScoreColor = (v: number) => {
    if (v >= 80) return "text-green-score";
    if (v >= 60) return "text-yellow-score";
    return "text-red-score";
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-center mb-6">AI 引用概率评分</h2>
      
      <div className="flex justify-center mb-8">
        <CircularProgress value={scores.total} size={160} strokeWidth={12} colorClass={getScoreColor(scores.total)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MiniScore label="结构清晰" value={scores.structure} />
        <MiniScore label="实体密度" value={scores.entityDensity} />
        <MiniScore label="搜索覆盖" value={scores.queryCoverage} />
        <MiniScore label="可引用性" value={scores.quotability} />
      </div>
    </motion.div>
  );
}
