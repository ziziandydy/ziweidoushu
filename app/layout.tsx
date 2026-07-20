import React from 'react';
import Script from 'next/script';
import '../public/styles.css'; // Import the global styles directly from public (or we should ideally move input.css to app)

export const metadata = {
    title: 'AI 紫微斗數 - 現代化的命理分析系統',
    description: '結合傳統中州派理論與 AI 技術，提供精準的命理分析。',
    icons: {
        icon: '/favicon.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-TW">
            <body className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-WJJN3TGM"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>
                {children}

                {/* Google Tag Manager */}
                <Script id="gtm" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
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
