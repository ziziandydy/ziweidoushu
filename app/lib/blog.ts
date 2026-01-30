import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

export type BlogPost = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    published_at: Date;
    created_at: Date;
    slug: string;
    language: string;
};

export type PaginationParams = {
    page?: number;
    tag?: string;
    limit?: number;
    locale?: string;
};

export type PaginationResult = {
    posts: BlogPost[];
    allTags: string[];
    totalPages: number;
    currentPage: number;
    totalPosts: number;
};

export async function getBlogPosts({ page = 1, tag, limit = 9, locale = 'zh-TW' }: PaginationParams): Promise<PaginationResult> {
    const offset = (page - 1) * limit;
    const language = locale === 'en' ? 'en' : 'zh-TW';

    try {
        // Count total posts
        let countResult;
        if (tag) {
            countResult = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = 'published' AND language = ${language} AND ${tag} = ANY(tags)
      `;
        } else {
            countResult = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = 'published' AND language = ${language}
      `;
        }

        const totalPosts = parseInt(countResult.rows[0].total as string);
        const totalPages = Math.ceil(totalPosts / limit);

        // Fetch posts
        let postsResult;
        if (tag) {
            postsResult = await sql`
        SELECT id, title, LEFT(content, 200) as excerpt, content, tags, published_at, created_at, slug, language
        FROM blog_posts
        WHERE status = 'published' AND language = ${language} AND ${tag} = ANY(tags)
        ORDER BY published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
        } else {
            postsResult = await sql`
        SELECT id, title, LEFT(content, 200) as excerpt, content, tags, published_at, created_at, slug, language
        FROM blog_posts
        WHERE status = 'published' AND language = ${language}
        ORDER BY published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
        }

        // Fetch tags
        const tagsResult = await sql`
      SELECT DISTINCT jsonb_array_elements_text(tags) as tag
      FROM blog_posts
      WHERE status = 'published' AND language = ${language}
    `;
        const allTags = tagsResult.rows.map(row => row.tag);

        return {
            posts: postsResult.rows as BlogPost[],
            allTags,
            totalPages,
            currentPage: page,
            totalPosts
        };
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        throw new Error('Failed to fetch blog posts');
    }
}

export async function getBlogPost(slug: string, locale: string = 'zh-TW'): Promise<BlogPost | null> {
    const language = locale === 'en' ? 'en' : 'zh-TW';
    try {
        const result = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND language = ${language} AND status = 'published'
    `;
        return (result.rows[0] as BlogPost) || null;
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
        return null;
    }
}
