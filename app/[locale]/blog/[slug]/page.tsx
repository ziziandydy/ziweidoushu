
import { getBlogPost, getAlternateLanguageSlug, getPostNeighbours } from '../../../lib/blog';
import BlogPost from '../../../components/blog/BlogPost';
import { notFound } from 'next/navigation';
import { orgId, breadcrumbNode } from '../../../lib/schema';

export async function generateMetadata(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(decodeURIComponent(params.slug), params.locale);
    if (!post) return { title: 'Not Found' };

    const isEn = params.locale === 'en';
    const alternate = await getAlternateLanguageSlug(post);
    const languages: Record<string, string> = {
        [params.locale === 'en' ? 'en' : 'zh-TW']: `https://aiziwei.online/${params.locale}/blog/${post.slug}`,
    };
    if (alternate) {
        languages[alternate.locale] = `https://aiziwei.online/${alternate.locale}/blog/${alternate.slug}`;
        languages['x-default'] = languages['zh-TW'];
    }

    const ogImage = `https://aiziwei.online/${params.locale}/blog/${encodeURI(post.slug)}/opengraph-image`;

    return {
        title: `${post.title} | ${isEn ? 'AI Zi Wei Dou Shu Blog' : '紫微斗數 AI 部落格'}`,
        description: post.excerpt,
        alternates: {
            canonical: `https://aiziwei.online/${params.locale}/blog/${post.slug}`,
            languages,
        },
        openGraph: {
            type: 'article',
            url: `https://aiziwei.online/${params.locale}/blog/${post.slug}`,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            images: [ogImage],
        },
    }
}

export default async function LocalizedBlogPostPage(props: { params: Promise<{ locale: string, slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(decodeURIComponent(params.slug), params.locale);

    if (!post) {
        notFound();
    }

    const neighbours = await getPostNeighbours(post);

    const isEn = params.locale === 'en';
    const blogPosting = {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.published_at).toISOString(),
        dateModified: new Date(post.updated_at || post.published_at).toISOString(),
        url: `https://aiziwei.online/${params.locale}/blog/${post.slug}`,
        inLanguage: isEn ? 'en' : 'zh-TW',
        author: {
            '@type': 'Person',
            name: post.author || '王老師',
            url: `https://aiziwei.online/${params.locale}/about`,
        },
        publisher: { '@id': orgId },
        keywords: post.tags?.join(', '),
    };
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            blogPosting,
            breadcrumbNode([
                { name: isEn ? 'Home' : '首頁', path: `/${params.locale}` },
                { name: isEn ? 'Blog' : '部落格', path: `/${params.locale}/blog` },
                { name: post.title, path: `/${params.locale}/blog/${post.slug}` },
            ]),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPost post={post} lang={params.locale} related={neighbours.related} newer={neighbours.newer} older={neighbours.older} />
        </>
    );
}
