'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NavBar({ locale }: { locale: string }) {
    const [langOpen, setLangOpen] = useState(false);
    const isEn = locale === 'en';

    const t = isEn ? {
        siteName: 'AI Zi Wei Dou Shu',
        blog: '📝 Blog',
        startAnalysis: '🚀 Start Analysis',
        currentLang: 'English',
        switchLang: '繁體中文',
    } : {
        siteName: 'AI 紫微斗數',
        blog: '📝 部落格',
        startAnalysis: '🚀 開始分析命盤',
        currentLang: '繁體中文',
        switchLang: 'English',
    };

    const otherLocale = isEn ? 'zh-TW' : 'en';
    const analysisHref = `/${locale}/analysis`;
    const blogHref = `/${locale}/blog`;
    const homeHref = `/${locale}/`;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href={homeHref} className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        {t.siteName}
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Language switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(o => !o)}
                            className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            <span className="hidden sm:inline text-sm">{t.currentLang}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                                <div className="py-2">
                                    <Link
                                        href={`/zh-TW/blog`}
                                        onClick={() => setLangOpen(false)}
                                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-purple-50 ${!isEn ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        <span>🇹🇼</span><span>繁體中文</span>
                                    </Link>
                                    <Link
                                        href={`/en/blog`}
                                        onClick={() => setLangOpen(false)}
                                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-purple-50 ${isEn ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        <span>🇺🇸</span><span>English</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Blog link */}
                    <Link
                        href={blogHref}
                        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition-all font-medium text-sm sm:text-base"
                    >
                        {t.blog}
                    </Link>

                    {/* CTA */}
                    <Link
                        href={analysisHref}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                    >
                        {t.startAnalysis}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
