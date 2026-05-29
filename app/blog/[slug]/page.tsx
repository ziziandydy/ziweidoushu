
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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.published_at).toISOString(),
        dateModified: new Date(post.updated_at || post.published_at).toISOString(),
        url: `https://aiziwei.online/blog/${post.slug}`,
        inLanguage: 'zh-TW',
        author: {
            '@type': 'Person',
            name: '王老師',
            url: 'https://aiziwei.online/about',
        },
        publisher: {
            '@type': 'Organization',
            name: 'AI 紫微斗數',
            url: 'https://aiziwei.online',
            logo: {
                '@type': 'ImageObject',
                url: 'https://aiziwei.online/favicon.svg',
            },
        },
        keywords: post.tags?.join(', '),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPost post={post} lang="zh-TW" />
        </>
    );
}
