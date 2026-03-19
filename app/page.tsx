'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteInput from '@/components/NoteInput';
import ScoreCard from '@/components/ScoreCard';
import QueryCoverage from '@/components/QueryCoverage';
import SentenceAnalysis from '@/components/SentenceAnalysis';
import RewritePanel from '@/components/RewritePanel';
import LoadingState from '@/components/LoadingState';
import { analyzeNote } from '@/lib/scoring';
import { AnalysisResult } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (note: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await analyzeNote(note);
      setResult(res);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('分析失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔴</span>
            <span className="font-bold text-xl tracking-tight">GSEO</span>
            <span className="text-sm text-gray-500 ml-2 hidden sm:inline-block">
              [小红书创作者AI搜索优化]
            </span>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-600 hover:text-red-primary transition-colors"
            >
              重新分析
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <AnimatePresence mode="wait">
          {!isLoading && !result && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NoteInput onSubmit={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="space-y-8"
            >
              {/* Top Section: Score & Query Coverage */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <ScoreCard scores={result.scores} />
                </div>
                <div className="lg:col-span-2">
                  <QueryCoverage queries={result.queries} />
                </div>
              </div>

              {/* Middle Section: Sentence Analysis */}
              <SentenceAnalysis 
                sentences={result.sentences} 
                readability={result.readability} 
              />

              {/* Bottom Section: Rewrite Panel */}
              <RewritePanel rewrite={result.rewrite} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
