import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import NavBar from '../components/NavBar';
import '../../public/styles.css'; // Import the global styles directly from public (or we should ideally move input.css to app)

export const metadata = {
    title: 'AI 紫微斗數 - 現代化的命理分析系統',
    description: '結合傳統中州派理論與 AI 技術，提供精準的命理分析。',
    icons: {
        icon: '/favicon.svg',
    },
    other: {
        'google-adsense-account': 'ca-pub-3240143153468832',
    },
}

const SUPPORTED_LOCALES = ['zh-TW', 'en'];

// 不支援的 locale 直接 404（由 app/global-not-found.tsx 輸出完整文件）
export const dynamicParams = false;

export function generateStaticParams() {
    return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

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
        <html lang={locale}>
            <body className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-WJJN3TGM"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>
                <NavBar locale={locale} />
                {/* pt-20 compensates for the fixed nav height */}
                <div className="pt-20">
                    {children}
                </div>

                {/* Google Tag Manager；自動化瀏覽器（navigator.webdriver）不載入，避免爬蟲灌水 GA4 */}
                <Script id="gtm" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){if(w.navigator.webdriver)return;w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WJJN3TGM');`}
                </Script>

                {/* Google AdSense */}
                <Script
                    id="adsense"
                    strategy="afterInteractive"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3240143153468832"
                    crossOrigin="anonymous"
                />

                {/* Groundhog tracker */}
                <Script id="groundhog" strategy="afterInteractive">
                    {`(function () {
    var u = 'https://violet.ghtinc.com/tracking/groundhogSensitiveCookie';
    var g = document.createElement('script');
    g.type = 'text/javascript';
    g.async = true;
    g.src = u;
    document.getElementsByTagName('head')[0].appendChild(g);
})();
var _ghq = (window._ghq = window._ghq || []);
(function (t) {
    var u = 'https://violet.ghtinc.com/tracking',
        j = document.createElement('script');
    _ghq.push(['setTrackerUrl', u + '/track/v2']);
    _ghq.push(['setTrackerId', t]);
    j.type = 'text/javascript';
    j.async = true;
    j.src = u + '/groundhog-tracker.js';
    document.getElementsByTagName('head')[0].appendChild(j);
})('690824af70a364b9708be1f6');
window._ghq.push(['trackEvent', 'track', 'PageView']);`}
                </Script>
                        </body>
        </html>
    )
}
