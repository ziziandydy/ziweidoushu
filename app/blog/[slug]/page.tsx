
import { getBlogPost } from '../../lib/blog';
import BlogPost from '../../components/blog/BlogPost';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(params.slug, 'zh-TW');
    if (!post) return { title: 'Not Found' };

    return {
        title: `${post.title} | 紫微斗數 AI 部落格`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(params.slug, 'zh-TW');

    if (!post) {
        notFound();
    }

    return <BlogPost post={post} lang="zh-TW" />;
}
