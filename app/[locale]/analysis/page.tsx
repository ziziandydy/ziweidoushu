import React from 'react';
import type { Metadata } from 'next';
import AnalysisClient from './AnalysisClient';
import { getAnalysisDict } from './translations';

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
            images: [{ url: 'https://aiziwei.online/og-image.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.meta.ogTitle,
            description: t.meta.ogDescription,
            images: ['https://aiziwei.online/og-image.png'],
        },
        alternates: {
            canonical: `https://aiziwei.online/${locale}/analysis`,
            languages: {
                'zh-TW': 'https://aiziwei.online/zh-TW/analysis',
                'en': 'https://aiziwei.online/en/analysis',
            },
        },
    };
}

export default async function AnalysisPage({ params }: Props) {
    const { locale } = await params;
    const t = getAnalysisDict(locale);
    return <AnalysisClient locale={locale} t={t} />;
}
