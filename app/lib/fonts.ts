import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';

// 自架的繁中字型；serif 只用在部落格與文章標題
export const fontSans = Noto_Sans_TC({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
});

export const fontSerif = Noto_Serif_TC({
    weight: ['600'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-serif',
});

export const fontVariables = `${fontSans.variable} ${fontSerif.variable}`;
