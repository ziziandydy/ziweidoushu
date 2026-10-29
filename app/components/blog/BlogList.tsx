import React from 'react';
import Link from 'next/link';
import AdUnit from '../ads/AdUnit';

const VISIBLE_TAGS = 6;
// 中文版預設顯示的專欄系列（n8n 排程的系列標籤）；有文章才會出現，其餘標籤收在「更多」。
// 英文標籤沒有固定系列，維持依使用次數。
const FEATURED_TAGS_ZH = ['紫微入門', '人生議題', '流月四化', '年度四化', '二十四節氣', '時事觀點'];

export default function BlogList({ posts, pagination, lang, currentTag, allTags }: {
    posts: any[],
    pagination: { currentPage: number, totalPages: number, hasPrev: boolean, hasNext: boolean },
    lang: string,
    currentTag?: string,
    allTags: string[]
}) {
    const t = lang === 'en' ? {
        heading: 'Blog',
        subheading: 'Zi Wei Dou Shu knowledge, solar terms and monthly readings, and life topics.',
        allPosts: 'All',
        allTopics: 'All topics',
        prevPage: 'Previous',
        nextPage: 'Next',
        pageOf: 'Page',
        noPosts: 'No posts available',
        advertisement: 'Advertisement'
    } : {
        heading: '部落格',
        subheading: '紫微斗數知識、節氣與流月、人生議題。',
        allPosts: '全部',
        allTopics: '全部主題',
        prevPage: '上一頁',
        nextPage: '下一頁',
        pageOf: '第',
        noPosts: '目前沒有文章',
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

    const extractPlainText = (markdown: string) => {
        return markdown.replace(/[#*_`\[\]]/g, '').substring(0, 150) + '...';
    };

    // Column tags first (zh); otherwise allTags arrives sorted by use. Keep the current tag visible even when it is outside the top few.
    const featuredTags = lang === 'en' ? [] : FEATURED_TAGS_ZH.filter(tag => allTags.includes(tag));
    const topTags = featuredTags.length > 0 ? featuredTags : allTags.slice(0, VISIBLE_TAGS);
    const shownTags = currentTag && !topTags.includes(currentTag) ? [...topTags, currentTag] : topTags;
    const moreTags = allTags.filter(tag => !shownTags.includes(tag));

    const chip = (active: boolean) =>
        `inline-block rounded-lg px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${active
            ? 'bg-brand-600 text-white'
            : 'bg-white text-ink-700 border border-ink-200 hover:border-ink-400'}`;

    const pageBtn = 'rounded-lg border border-ink-300 bg-white px-4 py-2 text-ink-800 hover:bg-ink-100 transition-colors';
    const pageBtnOff = 'rounded-lg border border-ink-200 bg-white px-4 py-2 text-ink-400 cursor-not-allowed';

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-ink-900">{t.heading}</h1>
                <p className="mt-3 text-ink-600">{t.subheading}</p>
            </header>

            <nav aria-label={t.allTopics} className="mb-10">
                <div className="flex flex-wrap items-center gap-2">
                    <Link href={basePath} className={chip(!currentTag)}>{t.allPosts}</Link>
                    {shownTags.map(tag => (
                        <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tag)}`} className={chip(currentTag === tag)}>
                            {tag}
                        </Link>
                    ))}
                </div>
                {moreTags.length > 0 && (
                    <details className="mt-3 group">
                        <summary className="link cursor-pointer text-sm select-none list-none [&::-webkit-details-marker]:hidden">{t.allTopics}</summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {moreTags.map(tag => (
                                <Link key={tag} href={`${basePath}?tag=${encodeURIComponent(tag)}`} className={chip(false)}>
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </details>
                )}
            </nav>

            {posts.length === 0 ? (
                <div className="py-12">
                    <p className="text-xl text-ink-500">{t.noPosts}</p>
                </div>
            ) : (
                <div className="max-w-3xl">
                    {posts.map((post, index) => (
                        <React.Fragment key={post.id}>
                            <article className="border-t border-ink-200 py-7">
                                <Link href={`${basePath}/${post.slug}`} className="group block">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                        <h2 className="font-serif font-semibold text-xl md:text-2xl leading-snug text-ink-900 group-hover:text-brand-700 transition-colors">
                                            {post.title}
                                        </h2>
                                        <time dateTime={post.published_at || post.created_at} className="text-sm text-ink-500 tabular-nums whitespace-nowrap">
                                            {formatDate(post.published_at || post.created_at)}
                                        </time>
                                    </div>
                                    <p className="mt-2 text-ink-600 line-clamp-2 leading-relaxed">
                                        {extractPlainText(post.excerpt || post.content)}
                                    </p>
                                </Link>
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {post.tags.slice(0, 5).map((tag: string) => (
                                            <span key={tag} className="rounded-md bg-ink-100 px-2.5 py-0.5 text-xs text-ink-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>

                            {/* Inline ad every 6th post */}
                            {(index + 1) % 6 === 0 && index < posts.length - 1 && (
                                <div className="my-4">
                                    <AdUnit
                                        slot="7607800035"
                                        style={{ display: 'inline-block', width: 728, height: 90 }}
                                        wrapperClassName="hidden md:flex md:justify-center"
                                        label={t.advertisement}
                                    />
                                    <AdUnit
                                        slot="7607800035"
                                        format="auto"
                                        fullWidthResponsive
                                        wrapperClassName="md:hidden"
                                        label={t.advertisement}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    <div className="border-t border-ink-200" />
                </div>
            )}

            {/* Bottom Banner Ad */}
            <AdUnit
                slot="5671756041"
                style={{ display: 'inline-block', width: 728, height: 90 }}
                wrapperClassName="hidden md:flex md:justify-center my-12"
                label={t.advertisement}
            />
            <AdUnit
                slot="5671756041"
                format="fluid"
                layoutKey="-fb+5w+4e-db+86"
                wrapperClassName="md:hidden my-8"
                label={t.advertisement}
            />

            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    {pagination.hasPrev ? (
                        <Link href={`${basePath}?page=${pagination.currentPage - 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}`} className={pageBtn}>
                            {t.prevPage}
                        </Link>
                    ) : (
                        <button type="button" className={pageBtnOff} disabled>
                            {t.prevPage}
                        </button>
                    )}
                    <span className="text-ink-600 tabular-nums">
                        {lang === 'en' ? `${t.pageOf} ${pagination.currentPage} / ${pagination.totalPages}` : `${t.pageOf} ${pagination.currentPage} / ${pagination.totalPages} 頁`}
                    </span>
                    {pagination.hasNext ? (
                        <Link href={`${basePath}?page=${pagination.currentPage + 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}`} className={pageBtn}>
                            {t.nextPage}
                        </Link>
                    ) : (
                        <button type="button" className={pageBtnOff} disabled>
                            {t.nextPage}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
