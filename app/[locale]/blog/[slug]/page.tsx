
import { getBlogPost } from '../../../lib/blog';
import BlogPost from '../../../components/blog/BlogPost';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(decodeURIComponent(params.slug), params.locale);
    if (!post) return { title: 'Not Found' };

    const isEn = params.locale === 'en';
    return {
        title: `${post.title} | ${isEn ? 'AI Zi Wei Dou Shu Blog' : '紫微斗數 AI 部落格'}`,
        description: post.excerpt,
        openGraph: {
            images: [{ url: 'https://aiziwei.online/og-image.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            images: ['https://aiziwei.online/og-image.png'],
        },
    }
}

export default async function LocalizedBlogPostPage(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(decodeURIComponent(params.slug), params.locale);

    if (!post) {
        notFound();
    }

    const isEn = params.locale === 'en';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.published_at).toISOString(),
        dateModified: new Date(post.updated_at || post.published_at).toISOString(),
        url: `https://aiziwei.online/${params.locale}/blog/${post.slug}`,
        inLanguage: isEn ? 'en' : 'zh-TW',
        author: {
            '@type': 'Organization',
            name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
            url: 'https://aiziwei.online',
        },
        publisher: {
            '@type': 'Organization',
            name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
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
            <BlogPost post={post} lang={params.locale} />
        </>
    );
}
