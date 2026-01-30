
import { getBlogPost } from '../../../lib/blog';
import BlogPost from '../../../components/blog/BlogPost';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(params.slug, params.locale);
    if (!post) return { title: 'Not Found' };

    const isEn = params.locale === 'en';
    return {
        title: `${post.title} | ${isEn ? 'AI Zi Wei Dou Shu Blog' : '紫微斗數 AI 部落格'}`,
        description: post.excerpt,
    }
}

export default async function LocalizedBlogPostPage(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(params.slug, params.locale);

    if (!post) {
        notFound();
    }

    return <BlogPost post={post} lang={params.locale} />;
}
