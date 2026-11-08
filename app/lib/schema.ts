// Shared schema.org building blocks so every page describes the same entity the same way.
const SITE = 'https://aiziwei.online';

export const orgId = `${SITE}/#organization`;

export function orgNode(isEn: boolean) {
    return {
        '@type': 'Organization',
        '@id': orgId,
        name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/logo-mark.svg` },
        email: 'support@aiziwei.online',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@aiziwei.online',
            url: 'https://forms.gle/KnwbQqyRGBVFqBPQ6',
            availableLanguage: ['zh-TW', 'en'],
        },
        // Add `sameAs` here once the site has real public profiles to point at.
    };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `${SITE}${item.path}`,
        })),
    };
}

// Only pass questions and answers that are visible on the page.
export function faqNode(items: { q: string; a: unknown }[]) {
    return {
        '@type': 'FAQPage',
        mainEntity: items.filter((item) => typeof item.a === 'string').map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
}
