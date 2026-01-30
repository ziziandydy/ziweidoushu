
import { getBlogPosts } from '../lib/blog';
import BlogList from '../components/blog/BlogList';

export const metadata = {
    title: '紫微斗數 AI 部落格 | 探索命理智慧',
    description: '探索紫微斗數命理智慧，每日更新運勢與星曜解析',
};

// Next.js 15+ searchParams are promises, so we need to await them
export default async function BlogPage(props: { searchParams: Promise<{ page?: string; tag?: string }> }) {
    const searchParams = await props.searchParams;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const tag = searchParams.tag;

    // Default locale for /blog is zh-TW
    const locale = 'zh-TW';

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
