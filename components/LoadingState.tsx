'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  { text: '正在读取你的笔记内容...', duration: 2000 },
  { text: '分析内容结构和实体...', duration: 4000 },
  { text: '模拟用户搜索行为...', duration: 4000 },
  { text: '计算语义覆盖率...', duration: 4000 },
  { text: '生成优化版本...', duration: 5000 },
  { text: '整理分析报告...', duration: 1000 },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let stepIndex = 0;

    const nextStep = () => {
      if (stepIndex < LOADING_STEPS.length - 1) {
        timeoutId = setTimeout(() => {
          stepIndex++;
          setCurrentStep(stepIndex);
          nextStep();
        }, LOADING_STEPS[stepIndex].duration);
      }
    };

    nextStep();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 20000; // 20 seconds
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutQuad formula for smooth deceleration
      const easeOut = t * (2 - t);
      setProgress(Math.floor(easeOut * 98)); // Go up to 98%
      
      if (t >= 1) clearInterval(interval);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 w-full max-w-md mx-auto">
      <div className="flex space-x-2 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-red-primary"
            animate={{
              y: ['0%', '-50%', '0%'],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div 
          className="bg-red-primary h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "98%" }}
          transition={{ duration: 20, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between items-center w-full text-sm font-medium text-gray-500 px-1">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-gray-600"
        >
          {LOADING_STEPS[currentStep].text}
        </motion.div>
        <span className="font-dm-sans text-red-primary font-bold">{progress}%</span>
      </div>
    </div>
  );
}
