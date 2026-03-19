'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface NoteInputProps {
  onSubmit: (note: string) => void;
  isLoading: boolean;
}

const EXAMPLE_1 = `去了传说中的咖啡店，真的很好喝！环境也不错，很适合拍照。店里人挺多的，
建议早点去。他们家的拿铁真的绝了，奶泡打得很细腻。价格不算便宜但值得。
下次还会来！强烈推荐给喜欢咖啡的朋友们。`;

const EXAMPLE_2 = `最近皮肤状态好了很多！分享一下我的护肤步骤。早上先用洗面奶洗脸，然后
涂一些水乳，出门前记得防晒。晚上的话会多加一步精华。坚持了一个月感觉
皮肤变光滑了，毛孔也小了一点。护肤真的很重要！`;

export default function NoteInput({ onSubmit, isLoading }: NoteInputProps) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim() && !isLoading) {
      onSubmit(note);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          让 AI 更容易找到你的内容
        </h1>
        <p className="text-gray-600 text-lg">
          输入你的小红书笔记，获取生成式搜索优化建议
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
        <textarea
          className="w-full min-h-[200px] p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-red-primary focus:ring-2 focus:ring-red-primary/20 outline-none resize-y text-gray-800 placeholder-gray-400 transition-all duration-200 mb-6"
          placeholder="粘贴你的小红书笔记内容..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            type="button"
            onClick={() => setNote(EXAMPLE_1)}
            className="text-sm px-4 py-2 rounded-full bg-red-bg text-red-primary hover:bg-red-100 transition-colors font-medium"
            disabled={isLoading}
          >
            示例：纽约咖啡探店
          </button>
          <button
            type="button"
            onClick={() => setNote(EXAMPLE_2)}
            className="text-sm px-4 py-2 rounded-full bg-red-bg text-red-primary hover:bg-red-100 transition-colors font-medium"
            disabled={isLoading}
          >
            示例：护肤分享
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={!note.trim() || isLoading}
            className={`
              flex items-center justify-center px-8 py-4 rounded-full text-white font-bold text-lg w-full md:w-auto min-w-[200px]
              transition-all duration-300 transform
              ${!note.trim() || isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-red-primary hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-primary/30'}
            `}
          >
            {isLoading ? '分析中...' : '开始分析 →'}
          </button>
          <p className="text-xs text-gray-400 mt-4">
            分析过程约需 15-20 秒
          </p>
        </div>
      </form>
    </motion.div>
  );
}
