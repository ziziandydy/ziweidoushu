
import React from 'react';
import Link from 'next/link';

export default function BlogList({ posts, pagination, lang, currentTag, allTags }: {
    posts: any[],
    pagination: { currentPage: number, totalPages: number, hasPrev: boolean, hasNext: boolean },
    lang: string,
    currentTag?: string,
    allTags: string[]
}) {
    const t = lang === 'en' ? {
        allPosts: 'All',
        readMore: 'Read More →',
        prevPage: 'Previous',
        nextPage: 'Next',
        pageOf: 'Page',
        noPosts: 'No posts available',
        advertisement: 'Advertisement'
    } : {
        allPosts: '全部',
        readMore: '閱讀更多 →',
        prevPage: '上一頁',
        nextPage: '下一頁',
        pageOf: '第',
        noPosts: '目前沒有文章',
        advertisement: '廣告'
    };

    const blogPath = lang === 'en' ? '/en/blog' : '/blog'; // Default to /blog which is zh-TW
    // Actually if we are at /blog (zh-TW), we want links to be /blog
    // If we are at /en/blog, we want links to be /en/blog
    // So let's pass a basePath prop or derive it.
    // For now, simplify: if lang is 'en', user /en/blog. Else /blog.

    const basePath = lang === 'en' ? '/en/blog' : '/blog';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const extractPlainText = (markdown: string) => {
        return markdown.replace(/[#*_`\[\]]/g, '').substring(0, 150) + '...';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Link href={basePath} className={`px-4 py-2 rounded-full transition-colors ${!currentTag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border hover:bg-purple-500 hover:text-white'}`}>
                    {t.allPosts}
                </Link>
                {allTags.slice(0, 15).map(tag => (
                    <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tag)}`} className={`px-4 py-2 rounded-full transition-colors ${currentTag === tag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border hover:bg-purple-500 hover:text-white'}`}>
                        {tag}
                    </Link>
                ))}
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">{t.noPosts}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                            <Link href={`${basePath}/${post.slug}`} className="block p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                                    {extractPlainText(post.excerpt || post.content)}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags && post.tags.slice(0, 5).map((tag: string) => (
                                        <span key={tag} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                    <span className="text-purple-600 font-semibold">{t.readMore}</span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                    {pagination.hasPrev ? (
                        <Link href={`${basePath}?page=${pagination.currentPage - 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            {t.prevPage}
                        </Link>
                    ) : (
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed" disabled>
                            {t.prevPage}
                        </button>
                    )}
                    <span className="text-gray-700">
                        {lang === 'en' ? `${t.pageOf} ${pagination.currentPage} / ${pagination.totalPages}` : `${t.pageOf} ${pagination.currentPage} / ${pagination.totalPages} 頁`}
                    </span>
                    {pagination.hasNext ? (
                        <Link href={`${basePath}?page=${pagination.currentPage + 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            {t.nextPage}
                        </Link>
                    ) : (
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed" disabled>
                            {t.nextPage}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
