'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = { id: string; title: string; url: string; excerpt?: string; published_at?: string; created_at?: string };

// 首頁維持靜態：最新文章在瀏覽器端向既有的文章列表 API 取得，不新增伺服器端 Function
export default function LatestPosts({ locale, heading, allLabel }: { locale: string; heading: string; allLabel: string }) {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [failed, setFailed] = useState(false);
    const blogHref = `/${locale}/blog`;

    useEffect(() => {
        let cancelled = false;
        fetch(`/api/blog/list?limit=3&language=${encodeURIComponent(locale)}`)
            .then(res => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then(json => { if (!cancelled) setPosts(Array.isArray(json?.data?.posts) ? json.data.posts.slice(0, 3) : []); })
            .catch(() => { if (!cancelled) setFailed(true); });
        return () => { cancelled = true; };
    }, [locale]);

    // published_at is stored without a time zone; format in UTC so dates match the server-rendered blog list
    const formatDate = (s?: string) => (s ? new Date(s).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }) : '');
    const plain = (md?: string) => (md || '').replace(/\(https?:[^)]*\)/g, '').replace(/^\s*[-*]\s+/gm, '').replace(/[#*_`>\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);

    const empty = failed || (posts !== null && posts.length === 0);

    return (
        <section className="max-w-6xl mx-auto px-4 py-14" aria-labelledby="latest-heading">
            <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 id="latest-heading" className="text-2xl font-bold text-ink-900">{heading}</h2>
                <Link href={blogHref} className="link text-sm">{allLabel}</Link>
            </div>

            {empty ? null : posts === null ? (
                <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]" aria-hidden="true">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="border-t-2 border-ink-200 pt-4 space-y-3">
                            <div className="h-3 w-20 rounded bg-ink-100" />
                            <div className="h-5 w-full rounded bg-ink-100" />
                            <div className="h-5 w-2/3 rounded bg-ink-100" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
                    {posts.map((p, i) => (
                        <article key={p.id} className="border-t-2 border-ink-900 pt-4 grid gap-2 content-start">
                            <time dateTime={p.published_at || p.created_at} className="text-xs text-ink-500 tabular-nums">
                                {formatDate(p.published_at || p.created_at)}
                            </time>
                            <h3 className={`font-serif font-semibold leading-snug text-ink-900 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                                <Link href={p.url} className="hover:text-brand-700 transition-colors">{p.title}</Link>
                            </h3>
                            {i === 0 && p.excerpt && <p className="text-ink-600 leading-relaxed">{plain(p.excerpt)}…</p>}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
