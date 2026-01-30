import React from 'react';
import '../public/styles.css'; // Import the global styles directly from public (or we should ideally move input.css to app)

export const metadata = {
    title: 'AI 紫微斗數 - 現代化的命理分析系統',
    description: '結合傳統中州派理論與 AI 技術，提供精準的命理分析。',
    icons: {
        icon: '/favicon.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-TW">
            <head>
                {/* Global Scripts like Google Analytics / AdSense can go here or in Script component */}
                {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3240143153468832" crossOrigin="anonymous"></script> */}
            </head>
            <body className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
                {children}
            </body>
        </html>
    )
}
