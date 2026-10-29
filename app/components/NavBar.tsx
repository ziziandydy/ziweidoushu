'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, X } from '@phosphor-icons/react';

export default function NavBar({ locale }: { locale: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname() || '/';
    const isEn = locale === 'en';

    const t = isEn ? {
        siteName: 'AI Zi Wei Dou Shu',
        blog: 'Blog',
        pricing: 'Pricing',
        startAnalysis: 'Start Analysis',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
    } : {
        siteName: 'AI 紫微斗數',
        blog: '部落格',
        pricing: '價格',
        startAnalysis: '開始分析命盤',
        openMenu: '開啟選單',
        closeMenu: '關閉選單',
    };

    const analysisHref = `/${locale}/analysis`;
    const blogHref = `/${locale}/blog`;
    const pricingHref = `/${locale}/pricing`;
    const homeHref = `/${locale}/`;
    const closeMenu = () => setMenuOpen(false);

    // 首頁第一屏已有排盤表單，導覽列不再重複放同目的的按鈕（"/" 由 vercel.json rewrite 到 /zh-TW）
    const isHome = pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`;
    const isBlog = pathname.startsWith(blogHref);
    const isPricing = pathname.startsWith(pricingHref);

    const navLink = (active: boolean) =>
        `px-1 py-2 font-medium transition-colors ${active
            ? 'text-ink-900 shadow-[inset_0_-2px_0_theme(colors.brand.600)]'
            : 'text-ink-600 hover:text-ink-900'}`;

    const langSwitcher = (
        <div className="flex items-center justify-center rounded-full p-1 bg-ink-100">
            {!isEn ? (
                <span className="px-3 py-1 rounded-full bg-white shadow-sm text-ink-900 font-medium text-sm">中文</span>
            ) : (
                <Link href="/zh-TW/blog" onClick={closeMenu} className="px-3 py-1 rounded-full text-ink-500 hover:text-ink-800 text-sm transition-colors">中文</Link>
            )}
            {isEn ? (
                <span className="px-3 py-1 rounded-full bg-white shadow-sm text-ink-900 font-medium text-sm">EN</span>
            ) : (
                <Link href="/en/blog" onClick={closeMenu} className="px-3 py-1 rounded-full text-ink-500 hover:text-ink-800 text-sm transition-colors">EN</Link>
            )}
        </div>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-ink-100 z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link href={homeHref} className="flex items-center gap-2.5" onClick={closeMenu}>
                    <img src="/logo-mark.svg" alt="" width={30} height={30} className="w-[30px] h-[30px]" />
                    <span className="text-lg font-bold text-ink-900">
                        {t.siteName}
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden sm:flex items-center gap-6">
                    <Link href={blogHref} className={navLink(isBlog)}>
                        {t.blog}
                    </Link>
                    <Link href={pricingHref} className={navLink(isPricing)}>
                        {t.pricing}
                    </Link>
                    {langSwitcher}
                    {!isHome && (
                        <Link href={analysisHref} className="btn-primary whitespace-nowrap px-4 py-2 text-sm">
                            {t.startAnalysis}
                        </Link>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    className="sm:hidden flex items-center justify-center w-10 h-10 -mr-2 text-ink-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                    aria-label={menuOpen ? t.closeMenu : t.openMenu}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(v => !v)}
                >
                    {menuOpen ? <X size={24} /> : <List size={24} />}
                </button>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div className="sm:hidden border-t border-ink-100 bg-white px-4 py-4 space-y-4">
                    <Link href={blogHref} onClick={closeMenu} className="block text-ink-800 font-medium py-1">
                        {t.blog}
                    </Link>
                    <Link href={pricingHref} onClick={closeMenu} className="block text-ink-800 font-medium py-1">
                        {t.pricing}
                    </Link>
                    {langSwitcher}
                    {!isHome && (
                        <Link href={analysisHref} onClick={closeMenu} className="btn-primary w-full py-3">
                            {t.startAnalysis}
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
