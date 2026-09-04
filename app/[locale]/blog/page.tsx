
import { getBlogPosts } from '../../lib/blog';
import BlogList from '../../components/blog/BlogList';

export async function generateMetadata(props: { params: Promise<{ locale: string }>, searchParams: Promise<{ page?: string; tag?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const isEn = params.locale === 'en';
    const otherLocale = isEn ? 'zh-TW' : 'en';

    const query = new URLSearchParams();
    if (searchParams.page) query.set('page', searchParams.page);
    if (searchParams.tag) query.set('tag', searchParams.tag);
    const qs = query.toString() ? `?${query.toString()}` : '';

    return {
        title: isEn ? 'AI Zi Wei Dou Shu Blog | Explore Destiny' : '紫微斗數 AI 部落格 | 探索命理智慧',
        description: isEn ? 'Explore destiny wisdom, daily fortune and star analysis' : '探索紫微斗數命理智慧，每日更新運勢與星曜解析',
        alternates: {
            canonical: `https://aiziwei.online/${params.locale}/blog${qs}`,
            languages: {
                [params.locale]: `https://aiziwei.online/${params.locale}/blog${qs}`,
                [otherLocale]: `https://aiziwei.online/${otherLocale}/blog${qs}`,
            },
        },
    };
}

export default async function LocalizedBlogPage(props: { params: Promise<{ locale: string }>, searchParams: Promise<{ page?: string; tag?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const tag = searchParams.tag;
    const locale = params.locale;

    // Validate locale, maybe redirect if not supported?
    // For now assuming rewriting or strict routing handles it.

    const data = await getBlogPosts({ page, tag, locale });

    return (
        <BlogList
            posts={data.posts}
            pagination={{
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                hasPrev: data.currentPage > 1,
                hasNext: data.currentPage < data.totalPages
            }}
            lang={locale}
            currentTag={tag}
            allTags={data.allTags}
        />
    );
}
