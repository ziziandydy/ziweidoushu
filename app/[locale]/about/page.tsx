import { OG_IMAGE_URL } from '../../lib/ogImage';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isEn = locale === 'en';
    return {
        title: isEn ? 'About | AI Zi Wei Dou Shu' : '關於本站 | AI 紫微斗數',
        description: isEn
            ? 'Who we are, our methodology, and our content policy.'
            : '認識 AI 紫微斗數：站點宗旨、理論方法與內容政策。',
        openGraph: {
            type: 'website',
            url: `https://aiziwei.online/${locale}/about`,
            images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            images: [OG_IMAGE_URL],
        },
        alternates: {
            canonical: `https://aiziwei.online/${locale}/about`,
            languages: {
                'zh-TW': 'https://aiziwei.online/zh-TW/about',
                'en': 'https://aiziwei.online/en/about',
                'x-default': 'https://aiziwei.online/zh-TW/about',
            },
        },
    };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isEn = locale === 'en';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: isEn ? 'About AI Zi Wei Dou Shu' : '關於本站',
        url: `https://aiziwei.online/${locale}/about`,
        inLanguage: isEn ? 'en' : 'zh-TW',
        // Same Organization as the homepage graph and the BlogPosting publisher
        mainEntity: {
            '@type': 'Organization',
            '@id': 'https://aiziwei.online/#organization',
            name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
            url: 'https://aiziwei.online',
            logo: { '@type': 'ImageObject', url: 'https://aiziwei.online/logo-mark.svg' },
        },
    };
    const jsonLdScript = (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    );

    if (isEn) {
        return (
            <main className="max-w-[44rem] mx-auto px-4 py-12">
                {jsonLdScript}
                <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-ink-900 prose-p:text-ink-800 prose-p:leading-[1.95] prose-strong:text-ink-900 prose-a:text-brand-600 prose-a:underline-offset-4 hover:prose-a:text-brand-700">
                    <h1>About AI Zi Wei Dou Shu</h1>
                    <p>AI Zi Wei Dou Shu (aiziwei.online) combines the Zhongzhou school of Zi Wei Dou Shu (Purple Star Astrology) with AI analysis to help readers explore this Chinese metaphysical tradition.</p>
                    <h2>Methodology</h2>
                    <p>Our analysis follows the Zhongzhou school framework (based on Wang Tingzhi&apos;s classical works). An in-house knowledge base of classical principles guides every AI-generated analysis and article, and articles cite the theoretical sources they draw on.</p>
                    <h2>Content policy</h2>
                    <p>Blog articles are AI-assisted and human-supervised, written from curated public sources with references listed at the end of each article. All content is for entertainment and cultural learning purposes only — it is not professional advice.</p>
                    <h2>Author</h2>
                    <p><strong>Wang Laoshi (王老師)</strong> — the site&apos;s editorial pen name. Articles are drafted with AI assistance from curated sources and our knowledge base, then reviewed by the site operator.</p>
                    <h2>Contact</h2>
                    <p>Email: support@aiziwei.online · <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6">Support form</a> · <a href="/privacy-policy">Privacy policy</a></p>
                </article>
            </main>
        );
    }

    return (
        <main className="max-w-[44rem] mx-auto px-4 py-12">
            {jsonLdScript}
            <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-ink-900 prose-p:text-ink-800 prose-p:leading-[1.95] prose-strong:text-ink-900 prose-a:text-brand-600 prose-a:underline-offset-4 hover:prose-a:text-brand-700">
                <h1>關於本站</h1>
                <p>AI 紫微斗數（aiziwei.online）結合中州派紫微斗數理論與 AI 技術，提供命盤分析工具與命理知識內容，希望讓更多人以現代方式認識這門傳統學問。</p>
                <h2>理論方法</h2>
                <p>本站以中州派（王亭之體系）為理論根據，站內建有整理自經典論述的知識庫，AI 分析與部落格文章皆以此為依據產出，並標明理論出處。</p>
                <h2>內容政策</h2>
                <p>部落格文章由 AI 輔助撰寫、人工監督，撰寫時參考外部公開文章並於文末附上引用來源。本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考，不構成專業建議。</p>
                <h2>作者</h2>
                <p><strong>王老師</strong> — 本站專欄筆名。文章由 AI 依據策展素材與知識庫起草，站長監督並定期抽查修正。</p>
                <h2>聯絡我們</h2>
                <p>Email：support@aiziwei.online · <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6">支援表單</a> · <a href="/privacy-policy">隱私政策</a></p>
            </article>
        </main>
    );
}
