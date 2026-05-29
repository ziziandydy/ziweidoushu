import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';

export default function BlogPost({ post, lang }: { post: any, lang: string }) {
    if (!post) notFound();

    const contentHtml = marked.parse(post.content || '') as string;

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

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 mb-8">
                <time dateTime={post.published_at || post.created_at} className="text-sm">
                    {formatDate(post.published_at || post.created_at)}
                </time>
                <span className="hidden sm:inline">•</span>
                <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag: string) => (
                        <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tag)}`} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap">
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>

            <div
                className="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-8"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            <div className="mt-12 text-center">
                <Link href={basePath} className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    {t.backToBlog}
                </Link>
            </div>
        </article>
    );
}
