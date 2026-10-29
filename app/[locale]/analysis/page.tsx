import React from 'react';
import type { Metadata } from 'next';
import AnalysisClient from './AnalysisClient';
import { getAnalysisDict } from './translations';
import { OG_IMAGE_URL } from '../../lib/ogImage';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return [{ locale: 'zh-TW' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = getAnalysisDict(locale);
    return {
        title: t.meta.title,
        description: t.meta.description,
        keywords: t.meta.keywords,
        openGraph: {
            title: t.meta.ogTitle,
            description: t.meta.ogDescription,
            images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.meta.ogTitle,
            description: t.meta.ogDescription,
            images: [OG_IMAGE_URL],
        },
        alternates: {
            canonical: `https://aiziwei.online/${locale}/analysis`,
            languages: {
                'zh-TW': 'https://aiziwei.online/zh-TW/analysis',
                'en': 'https://aiziwei.online/en/analysis',
                'x-default': 'https://aiziwei.online/zh-TW/analysis',
            },
        },
    };
}

export default async function AnalysisPage({ params }: Props) {
    const { locale } = await params;
    const t = getAnalysisDict(locale);
    const isEn = locale === 'en';
    // Same entity values as the homepage SoftwareApplication; name and description are text visible on this page
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
        url: `https://aiziwei.online/${locale}/analysis`,
        description: t.header.subtitle,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        inLanguage: isEn ? 'en' : 'zh-TW',
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AnalysisClient locale={locale} t={t} />
        </>
    );
}
