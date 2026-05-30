'use client';

import React from 'react';
import Link from 'next/link';

export default function NavBar({ locale }: { locale: string }) {
    const isEn = locale === 'en';

    const t = isEn ? {
        siteName: 'AI Zi Wei Dou Shu',
        blog: '📝 Blog',
        startAnalysis: '🚀 Start Analysis',
    } : {
        siteName: 'AI 紫微斗數',
        blog: '📝 部落格',
        startAnalysis: '🚀 開始分析命盤',
    };

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
                    <span className="text-xl font-bold gradient-text">
                        {t.siteName}
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Language switcher: two flag buttons */}
                    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                        <Link
                            href="/zh-TW/blog"
                            title="繁體中文"
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm transition-colors ${
                                !isEn
                                    ? 'bg-purple-600 text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                        >
                            <span>🇹🇼</span>
                            <span className="hidden sm:inline">中文</span>
                        </Link>
                        <div className="w-px h-5 bg-gray-200" />
                        <Link
                            href="/en/blog"
                            title="English"
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm transition-colors ${
                                isEn
                                    ? 'bg-purple-600 text-white font-medium'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                        >
                            <span>🇺🇸</span>
                            <span className="hidden sm:inline">EN</span>
                        </Link>
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
