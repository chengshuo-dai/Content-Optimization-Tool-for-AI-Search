import type {Metadata} from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'GSEO - 小红书创作者AI搜索优化',
  description: '输入你的小红书笔记，获取生成式搜索优化建议',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" className={`${dmSans.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
