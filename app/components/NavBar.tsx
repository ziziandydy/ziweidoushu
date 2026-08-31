'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NavBar({ locale }: { locale: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const isEn = locale === 'en';

    const t = isEn ? {
        siteName: 'AI Zi Wei Dou Shu',
        blog: 'Blog',
        startAnalysis: 'Start Analysis',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
    } : {
        siteName: 'AI 紫微斗數',
        blog: '部落格',
        startAnalysis: '開始分析命盤',
        openMenu: '開啟選單',
        closeMenu: '關閉選單',
    };

    const analysisHref = `/${locale}/analysis`;
    const blogHref = `/${locale}/blog`;
    const homeHref = `/${locale}/`;
    const closeMenu = () => setMenuOpen(false);

    const langSwitcher = (
        <div className="flex items-center justify-center rounded-full p-1 bg-purple-100">
            {!isEn ? (
                <span className="px-3 py-1 rounded-full bg-white shadow-sm text-purple-700 font-semibold text-sm">中文</span>
            ) : (
                <Link href="/zh-TW/blog" onClick={closeMenu} className="px-3 py-1 rounded-full text-purple-400 hover:text-purple-600 text-sm transition-colors">中文</Link>
            )}
            {isEn ? (
                <span className="px-3 py-1 rounded-full bg-white shadow-sm text-purple-700 font-semibold text-sm">EN</span>
            ) : (
                <Link href="/en/blog" onClick={closeMenu} className="px-3 py-1 rounded-full text-purple-400 hover:text-purple-600 text-sm transition-colors">EN</Link>
            )}
        </div>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href={homeHref} className="flex items-center space-x-2" onClick={closeMenu}>
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-xl font-bold gradient-text">
                        {t.siteName}
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden sm:flex items-center space-x-4">
                    {langSwitcher}
                    <Link
                        href={blogHref}
                        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition-all font-medium"
                    >
                        {t.blog}
                    </Link>
                    <Link
                        href={analysisHref}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                        {t.startAnalysis}
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    className="sm:hidden flex items-center justify-center w-10 h-10 -mr-2 text-gray-700"
                    aria-label={menuOpen ? t.closeMenu : t.openMenu}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(v => !v)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
                    <Link href={blogHref} onClick={closeMenu} className="block text-gray-700 font-medium py-1">
                        {t.blog}
                    </Link>
                    {langSwitcher}
                    <Link
                        href={analysisHref}
                        onClick={closeMenu}
                        className="block text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                    >
                        {t.startAnalysis}
                    </Link>
                </div>
            )}
        </nav>
    );
}
