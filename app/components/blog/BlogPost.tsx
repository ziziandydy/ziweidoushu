import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import AdUnit from '../ads/AdUnit';
import { AdSidebarRight } from '../ads/AdSidebar';

// Reading column: ~40 CJK characters wide, generous line height, ink text instead of the plugin's gray
const PROSE = 'prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-ink-900 prose-p:text-ink-800 prose-p:leading-[1.95] prose-li:text-ink-800 prose-strong:text-ink-900 prose-a:text-brand-600 prose-a:underline-offset-4 hover:prose-a:text-brand-700 prose-blockquote:border-brand-200 prose-blockquote:text-ink-600 prose-hr:border-ink-200';

type PostLink = { slug: string; title: string; published_at?: Date | string; created_at?: Date | string };

export default function BlogPost({ post, lang, related = [], newer = null, older = null }: {
    post: any,
    lang: string,
    related?: PostLink[],
    newer?: PostLink | null,
    older?: PostLink | null
}) {
    if (!post) notFound();

    // The pre-migration editor supported a `[TOC]` shortcode rendered client-side
    // via marked.js; that logic never made it into this SSR renderer, so any
    // legacy post still containing the literal marker would show it as raw text.
    const content = (post.content || '').replace(/^\[TOC\]\s*\n+/, '');

    // Split into two halves at the nearest paragraph boundary so an ad can sit
    // mid-article without a runtime DOM-injection pass (the old static page
    // used insertBefore() at render time, which doesn't map cleanly to SSR).
    const paragraphBlocks = content.split(/\n\s*\n/);
    const midpoint = Math.max(1, Math.floor(paragraphBlocks.length / 2));
    const hasSecondHalf = paragraphBlocks.length > 1;
    const firstHalfHtml = marked.parse(paragraphBlocks.slice(0, midpoint).join('\n\n')) as string;
    const secondHalfHtml = hasSecondHalf
        ? marked.parse(paragraphBlocks.slice(midpoint).join('\n\n')) as string
        : '';

    const t = lang === 'en' ? {
        backToBlog: '← Back to Blog',
        home: 'Home',
        blog: 'Blog',
        related: 'Related reading',
        newer: 'Newer',
        older: 'Older',
        advertisement: 'Advertisement'
    } : {
        backToBlog: '← 返回部落格',
        home: '首頁',
        blog: '部落格',
        related: '延伸閱讀',
        newer: '下一篇',
        older: '上一篇',
        advertisement: '廣告'
    };

    const basePath = lang === 'en' ? '/en/blog' : '/zh-TW/blog';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <AdSidebarRight label={t.advertisement} />

            <article className="max-w-[44rem] mx-auto px-4 py-12">
                <h1 className="font-serif font-semibold text-3xl md:text-4xl leading-snug text-ink-900 mb-5">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-500 pb-6 mb-8 border-b border-ink-200">
                    <span className="font-medium text-ink-800">{post.author || '王老師'}</span>
                    <time dateTime={post.published_at || post.created_at} className="tabular-nums">
                        {formatDate(post.published_at || post.created_at)}
                    </time>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="rounded-md bg-ink-100 px-2.5 py-0.5 text-xs text-ink-600 whitespace-nowrap">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className={PROSE}
                    dangerouslySetInnerHTML={{ __html: firstHalfHtml }}
                />

                {hasSecondHalf && (
                    <>
                        {/* Mid-article Ad */}
                        <AdUnit
                            slot="7607800035"
                            format="fluid"
                            layoutKey="-fb+5w+4e-db+86"
                            wrapperClassName="my-8"
                            label={t.advertisement}
                        />

                        <div
                            className={PROSE}
                            dangerouslySetInnerHTML={{ __html: secondHalfHtml }}
                        />
                    </>
                )}

                {related.length > 0 && (
                    <section aria-labelledby="related-heading" className="mt-12">
                        <h2 id="related-heading" className="text-2xl font-bold text-ink-900 mb-2">{t.related}</h2>
                        {related.map(p => (
                            <Link key={p.slug} prefetch={false} href={`${basePath}/${p.slug}`} className="group block border-t border-ink-200 py-4">
                                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                    <span className="font-serif font-semibold text-lg leading-snug text-ink-900 group-hover:text-brand-700 transition-colors">{p.title}</span>
                                    {(p.published_at || p.created_at) && (
                                        <time dateTime={new Date((p.published_at || p.created_at) as any).toISOString()} className="text-sm text-ink-500 tabular-nums whitespace-nowrap">
                                            {formatDate((p.published_at || p.created_at) as any)}
                                        </time>
                                    )}
                                </div>
                            </Link>
                        ))}
                        <div className="border-t border-ink-200" />
                    </section>
                )}

                {(older || newer) && (
                    <nav className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-4">
                        {older ? (
                            <Link prefetch={false} href={`${basePath}/${older.slug}`} className="group block max-w-3xl">
                                <span className="text-sm text-ink-500">← {t.older}</span>
                                <span className="block font-serif font-semibold text-lg leading-snug text-ink-900 group-hover:text-brand-700 transition-colors">{older.title}</span>
                            </Link>
                        ) : <span />}
                        {newer && (
                            <Link prefetch={false} href={`${basePath}/${newer.slug}`} className="group block max-w-3xl">
                                <span className="text-sm text-ink-500">{t.newer} →</span>
                                <span className="block font-serif font-semibold text-lg leading-snug text-ink-900 group-hover:text-brand-700 transition-colors">{newer.title}</span>
                            </Link>
                        )}
                    </nav>
                )}

                <div className="mt-12">
                    <Link href={basePath} className="btn-secondary">
                        {t.backToBlog}
                    </Link>
                </div>
            </article>
        </>
    );
}
