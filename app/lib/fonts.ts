import { Noto_Serif_TC } from 'next/font/google';

// 只有部落格與文章標題用自架襯線字型（單一字重）。
// 介面與內文用各平台內建的繁中字型（見 tailwind.config.js 的 fontFamily.sans）：
// 自架 Noto Sans TC 三個字重會讓每頁多載入約 25 個字型檔、1.4 MB，首屏明顯變慢。
export const fontSerif = Noto_Serif_TC({
    weight: ['600'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-serif',
});

export const fontVariables = fontSerif.variable;
