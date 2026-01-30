"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

export default function BlogPost({ post, lang }: { post: any, lang: string }) {
    if (!post) notFound();

    const [contentHtml, setContentHtml] = useState<string>('');

    const t = lang === 'en' ? {
        backToBlog: '← Back to Blog',
        home: 'Home',
        blog: 'Blog',
        advertisement: 'Advertisement'
    } : {
        backToBlog: '← 返回部落格',
        home: '首頁',
        blog: '部落格',
        advertisement: '廣告'
    };

    const basePath = lang === 'en' ? '/en/blog' : '/blog';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderMarkdown = () => {
        if (typeof window !== 'undefined' && (window as any).marked) {
            let rawHtml = (window as any).marked.parse(post.content || '');
            // Optional: purify
            if ((window as any).DOMPurify) {
                rawHtml = (window as any).DOMPurify.sanitize(rawHtml);
            }
            setContentHtml(rawHtml);
        }
    };

    useEffect(() => {
        renderMarkdown();
    }, [post.content]);

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <Script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" onLoad={renderMarkdown} />
            <Script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js" onLoad={renderMarkdown} />

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 mb-8">
                <span className="text-sm">{formatDate(post.published_at || post.created_at)}</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag: string) => (
                        <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tag)}`} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap">
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-8 min-h-[500px]" dangerouslySetInnerHTML={{ __html: contentHtml || '<div class="animate-pulse space-y-4"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-4 bg-gray-200 rounded"></div><div class="h-4 bg-gray-200 rounded"></div></div>' }}>
            </div>

            <div className="mt-12 text-center">
                <Link href={basePath} className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    {t.backToBlog}
                </Link>
            </div>
        </article>
    );
}
