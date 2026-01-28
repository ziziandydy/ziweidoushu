---
description: Managing the Blog System, Content Generation, and SEO Optimization
---

# Blog & SEO Management Skill

This skill guides the agent in managing the Zi Wei Dou Shu blog, including database operations, content generation logic, and SEO tag management.

## 1. Database Operations (Vercel Postgres)
The blog posts are stored in the `blog_posts` table.
- **Table Structure**: `id`, `slug`, `title`, `content` (Markdown), `excerpt`, `tags` (Array), `status` ('published' | 'draft'), `language` ('zh-TW' | 'en'), `published_at`.

### Common Queries
- **List Posts**:
    ```javascript
    const { sql } = require('@vercel/postgres');
    const posts = await sql\`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 10\`;
    ```
- **Insert Post**:
    ```javascript
    await sql\`
      INSERT INTO blog_posts (slug, title, content, excerpt, tags, status, language, published_at)
      VALUES (\${slug}, \${title}, \${content}, \${excerpt}, \${tags}, 'published', 'zh-TW', NOW())
    \`;
    ```

## 2. Content Generation Guidelines (The Astrologer Persona)
When generating content:
1.  **Tone**: Professional, culturally respectful (Traditional Chinese Astrology), yet accessible.
2.  **Structure**:
    -   **Hook**: Relate to current celestial events or common life questions.
    -   **Analysis**: Use "Star derivatives" (e.g., "Tai Yang in Hua Quan") terminology correctly.
    -   **Actionable Advice**: "Wear red", "avoid north direction", etc.
3.  **Formatting**: Use Markdown headers, bullet points, and **bold** text for key terms.

## 3. SEO Optimization
- **Meta Tags**: Ensure `api/blog-page.js` and `api/blog/[id].js` render unique `<title>` and `<meta name="description">` tags.
- **Sitemap**: The sitemap is generated at `/api/page?page=sitemap`. Ensure new posts are included.
- **Internal Linking**: Always link back to `/analysis.html` ("Calculated your Chart yet?") in every blog post.
