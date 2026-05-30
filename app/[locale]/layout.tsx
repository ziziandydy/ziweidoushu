import React from 'react';
import NavBar from '../components/NavBar';

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

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
