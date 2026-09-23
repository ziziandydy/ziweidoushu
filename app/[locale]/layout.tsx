import React from 'react';
import { notFound } from 'next/navigation';
import NavBar from '../components/NavBar';

const SUPPORTED_LOCALES = ['zh-TW', 'en'];

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!SUPPORTED_LOCALES.includes(locale)) {
        notFound();
    }

    return (
        <>
            <NavBar locale={locale} />
            {/* pt-20 compensates for the fixed nav height */}
            <div className="pt-20">
                {children}
            </div>
        </>
    );
}
