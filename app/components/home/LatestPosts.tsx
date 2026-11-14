import React from 'react';
import Link from 'next/link';

type Post = { slug: string; title: string; excerpt?: string; published_at?: Date | string; created_at?: Date | string };

// 伺服器端輸出：文章連結直接在首頁 HTML 裡，搜尋引擎不必執行 JavaScript 就能看到
export default function LatestPosts({ locale, heading, allLabel, posts }: { locale: string; heading: string; allLabel: string; posts: Post[] }) {
    const blogHref = `/${locale}/blog`;

    // published_at is stored without a time zone; format in UTC so dates match the server-rendered blog list
    const formatDate = (s?: Date | string) => (s ? new Date(s).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }) : '');
    const plain = (md?: string) => (md || '').replace(/\(https?:[^)]*\)/g, '').replace(/^\s*[-*]\s+/gm, '').replace(/[#*_`>\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);

    return (
        <section className="max-w-6xl mx-auto px-4 py-14" aria-labelledby="latest-heading">
            <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 id="latest-heading" className="text-2xl font-bold text-ink-900">{heading}</h2>
                <Link href={blogHref} className="link text-sm">{allLabel}</Link>
            </div>

            {posts.length > 0 && (
                <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
                    {posts.map((p, i) => {
                        const date = p.published_at || p.created_at;
                        return (
                            <article key={p.slug} className="border-t-2 border-ink-900 pt-4 grid gap-2 content-start">
                                <time dateTime={date ? new Date(date).toISOString() : undefined} className="text-xs text-ink-500 tabular-nums">
                                    {formatDate(date)}
                                </time>
                                <h3 className={`font-serif font-semibold leading-snug text-ink-900 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                                    <Link href={`${blogHref}/${p.slug}`} className="hover:text-brand-700 transition-colors">{p.title}</Link>
                                </h3>
                                {i === 0 && p.excerpt && <p className="text-ink-600 leading-relaxed">{plain(p.excerpt)}…</p>}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
