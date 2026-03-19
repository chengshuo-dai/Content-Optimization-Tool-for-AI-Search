'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface RewritePanelProps {
  rewrite: {
    content: string;
    improvements: string[];
  };
}

export default function RewritePanel({ rewrite }: RewritePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrite.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-2">✨</span> 优化后版本
        </h3>
        <button
          onClick={handleCopy}
          className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6 whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">
        {rewrite.content}
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">优化了什么：</h4>
        <ul className="space-y-2">
          {rewrite.improvements.map((imp, i) => (
            <li key={i} className="flex items-start text-sm text-gray-600">
              <span className="text-red-primary mr-2">•</span>
              {imp}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
