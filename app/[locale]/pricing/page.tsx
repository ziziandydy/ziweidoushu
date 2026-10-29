import Link from 'next/link';
import { Check } from '@phosphor-icons/react/dist/ssr/Check';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';
    const otherLocale = isEn ? 'zh-TW' : 'en';

    return {
        title: isEn
            ? 'Pricing | AI Zi Wei Dou Shu — Free & Paid Plans'
            : '價格方案 - AI 紫微斗數 | 免費與付費方案說明',
        description: isEn
            ? 'AI Zi Wei Dou Shu offers a free plan and a paid plan. The free plan includes 3 Q&A sessions per month; the paid plan (NT$199) unlocks 1 hour of unlimited Q&A.'
            : 'AI 紫微斗數提供免費和付費兩種方案。免費方案每月可進行 3 次問答，付費方案 NT$ 199 可解鎖 1 小時無限問答。立即了解詳細方案內容。',
        openGraph: {
            images: [{ url: 'https://aiziwei.online/og-image.png', width: 1200, height: 630 }],
        },
        twitter: { card: 'summary_large_image', images: ['https://aiziwei.online/og-image.png'] },
        alternates: {
            canonical: `https://aiziwei.online/${locale}/pricing`,
            languages: {
                [locale]: `https://aiziwei.online/${locale}/pricing`,
                [otherLocale]: `https://aiziwei.online/${otherLocale}/pricing`,
                'x-default': 'https://aiziwei.online/zh-TW/pricing',
            },
        },
    };
}

const freeFeaturesZh = [
    '每月 3 次免費問答機會',
    '完整的命盤計算與顯示',
    'AI 深度命理分析（初始解析）',
    '十二宮位與星曜詳細資訊',
    '支援農曆西曆轉換',
];

const freeFeaturesEn = [
    '3 free Q&A sessions per month',
    'Full destiny chart calculation & display',
    'AI-powered analysis (initial reading)',
    'Detailed info on all 12 palaces and stars',
    'Lunar / solar calendar conversion',
];

const paidFeaturesZh = [
    '1 小時內無限次問答',
    '包含所有免費方案功能',
    '連續對話功能，AI 記住上下文',
    '深度問答不受限制',
    '付款後立即生效',
    '安全付款（綠界金流信用卡）',
];

const paidFeaturesEn = [
    'Unlimited Q&A for 1 hour',
    'Everything in the free plan',
    'Continuous conversation — AI remembers context',
    'Unlimited in-depth Q&A',
    'Instant activation after payment',
    'Secure payment via ECPay credit card',
];

const faqZh = [
    { q: 'Q1: 免費次數何時重置？', a: '免費問答次數採用每月重置機制。每個月您都可以獲得 3 次免費問答機會，讓您隨時了解自己的命盤運勢。' },
    { q: 'Q2: 如何付款？', a: '我們使用綠界科技（ECPay）提供的安全金流系統，支援信用卡一次付清。付款過程簡單快速，只需幾分鐘即可完成。' },
    { q: 'Q3: 付款後可以使用多久？', a: '付費解鎖後，您可以在 1 小時內無限次使用 AI 問答功能。時間從付款成功的那一刻開始計算，您可以充分利用這段時間深入探索命盤的各個面向。' },
    { q: 'Q4: 可以退款嗎？', a: '由於是數位服務且付款後立即生效，目前不提供退款服務。建議您在付費前先使用免費方案體驗服務品質。如有特殊情況，請聯繫客服：support@aiziwei.online' },
    { q: 'Q5: 付費時段可以進行多次命盤分析嗎？', a: '可以的！付費解鎖後，您可以在 1 小時內針對同一個命盤進行無限次問答。這讓您可以深入探索命盤的各個面向，獲得最完整的命理分析。' },
    { q: 'Q6: 付款安全嗎？', a: '絕對安全！我們使用綠界科技的金流系統，這是台灣領先的第三方支付平台，所有付款資料都經過加密處理，我們不會保存您的信用卡資訊。' },
];

const faqEn = [
    { q: 'Q1: When do free credits reset?', a: 'Free Q&A credits reset monthly. Every month you get 3 free Q&A sessions to check in on your destiny chart.' },
    { q: 'Q2: How do I pay?', a: 'We use the secure payment system from ECPay, supporting one-time credit card payment. The process is quick and takes only a few minutes.' },
    { q: 'Q3: How long can I use it after paying?', a: 'Once unlocked, you get 1 hour of unlimited AI Q&A. The timer starts the moment payment succeeds, giving you plenty of time to explore your chart in depth.' },
    { q: 'Q4: Can I get a refund?', a: 'Since this is a digital service that activates immediately, refunds are not currently offered. We recommend trying the free plan first. For special circumstances, contact support@aiziwei.online' },
    { q: 'Q5: Can I analyze the same chart multiple times during the paid session?', a: 'Yes! Once unlocked, you can ask unlimited questions about the same chart for 1 hour, letting you explore every facet of your destiny analysis.' },
    { q: 'Q6: Is payment secure?', a: 'Absolutely. We use ECPay, a leading third-party payment platform in Taiwan. All payment data is encrypted, and we never store your credit card information.' },
];

export default async function PricingPage({ params }: Props) {
    const { locale } = await params;
    const isEn = locale === 'en';
    const analysisHref = `/${locale}/analysis`;

    const freeFeatures = isEn ? freeFeaturesEn : freeFeaturesZh;
    const paidFeatures = isEn ? paidFeaturesEn : paidFeaturesZh;
    const faq = isEn ? faqEn : faqZh;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數',
        url: `https://aiziwei.online/${locale}`,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        inLanguage: isEn ? 'en' : 'zh-TW',
        offers: [
            {
                '@type': 'Offer',
                name: isEn ? 'Free Plan' : '免費方案',
                description: isEn ? '3 free Q&A sessions per month' : '每月 3 次免費問答',
                price: '0',
                priceCurrency: 'TWD',
                url: `https://aiziwei.online/${locale}/pricing`,
            },
            {
                '@type': 'Offer',
                name: isEn ? 'Paid Unlock Plan' : '付費解鎖方案',
                description: isEn ? '1 hour of unlimited Q&A' : '1 小時無限問答',
                price: '199',
                priceCurrency: 'TWD',
                url: `https://aiziwei.online/${locale}/pricing`,
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="max-w-6xl mx-auto px-4 pt-14 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink-900">
                    {isEn ? 'Pricing' : '價格方案'}
                </h1>
                <p className="mt-4 text-lg text-ink-600 max-w-2xl">
                    {isEn ? 'Choose the plan that fits your destiny analysis needs' : '選擇最適合您的紫微斗數命理分析方案'}
                </p>
            </section>

            <section className="max-w-6xl mx-auto px-4 pb-14">
                <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
                    <div className="surface p-8 grid grid-rows-[auto_1fr_auto] gap-6">
                        <div>
                            <h2 className="text-lg font-medium text-ink-700">{isEn ? 'Free Plan' : '免費方案'}</h2>
                            <div className="mt-3 text-4xl font-bold tracking-tight text-ink-900 tabular-nums">NT$ 0</div>
                            <p className="mt-2 text-ink-600">{isEn ? 'Free forever' : '永久免費'}</p>
                        </div>
                        <ul className="grid gap-3 content-start text-ink-700">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-3">
                                    <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href={analysisHref} className="btn-secondary w-full py-3">
                            {isEn ? 'Start now' : '立即開始使用'}
                        </Link>
                    </div>

                    <div className="rounded-xl bg-brand-600 p-8 text-white grid grid-rows-[auto_1fr_auto] gap-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-medium text-white/90">{isEn ? 'Paid Unlock Plan' : '付費解鎖方案'}</h2>
                                <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-medium">{isEn ? 'Recommended' : '推薦方案'}</span>
                            </div>
                            <div className="mt-3 text-4xl font-bold tracking-tight tabular-nums">NT$ 199</div>
                            <p className="mt-2 text-white/85">{isEn ? '1 hour of unlimited Q&A' : '1 小時無限問答'}</p>
                        </div>
                        <ul className="grid gap-3 content-start">
                            {paidFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-3">
                                    <Check size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={analysisHref}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-white py-3 font-medium text-brand-700 transition hover:bg-brand-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
                        >
                            {isEn ? 'Go to analysis & unlock' : '前往分析頁面付費解鎖'}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white border-y border-ink-100">
                <div className="max-w-6xl mx-auto px-4 py-14">
                    <h2 className="text-2xl font-bold text-ink-900 mb-6">
                        {isEn ? 'Plan Comparison' : '方案功能對比'}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-ink-900 text-sm text-ink-600">
                                    <th scope="col" className="py-3 pr-2 sm:pr-4 font-medium">{isEn ? 'Feature' : '功能項目'}</th>
                                    <th scope="col" className="py-3 px-2 sm:px-4 font-medium text-center">{isEn ? 'Free' : '免費方案'}</th>
                                    <th scope="col" className="py-3 pl-2 sm:pl-4 font-medium text-center text-brand-700">{isEn ? 'Paid' : '付費方案'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-100 text-ink-700">
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'Chart calculation' : '命盤計算'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center"><Check size={18} weight="bold" className="inline text-ink-700" role="img" aria-label={isEn ? 'Included' : '包含'} /></td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center"><Check size={18} weight="bold" className="inline text-brand-600" role="img" aria-label={isEn ? 'Included' : '包含'} /></td>
                                </tr>
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'Initial AI analysis' : 'AI 初始解析'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center"><Check size={18} weight="bold" className="inline text-ink-700" role="img" aria-label={isEn ? 'Included' : '包含'} /></td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center"><Check size={18} weight="bold" className="inline text-brand-600" role="img" aria-label={isEn ? 'Included' : '包含'} /></td>
                                </tr>
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'Free Q&A sessions / month' : '每月免費問答次數'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center tabular-nums">{isEn ? '3' : '3 次'}</td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center tabular-nums">{isEn ? '3' : '3 次'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'Q&A during paid session' : '付費時段問答次數'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center text-ink-400">-</td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center font-bold text-brand-700">{isEn ? 'Unlimited' : '無限'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'Continuous conversation' : '連續對話功能'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center text-ink-400">-</td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center"><Check size={18} weight="bold" className="inline text-brand-600" role="img" aria-label={isEn ? 'Included' : '包含'} /></td>
                                </tr>
                                <tr>
                                    <th scope="row" className="py-4 pr-2 sm:pr-4 font-medium text-ink-900">{isEn ? 'In-depth Q&A' : '深度問答'}</th>
                                    <td className="py-4 px-2 sm:px-4 text-center text-ink-500">{isEn ? 'Limited' : '有限'}</td>
                                    <td className="py-4 pl-2 sm:pl-4 text-center font-medium text-brand-700">{isEn ? 'Unlimited' : '無限'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-14">
                <h2 className="text-2xl font-bold text-ink-900 mb-6">
                    {isEn ? 'FAQ' : '常見問題'}
                </h2>
                <dl className="border-b border-ink-200">
                    {faq.map((item) => (
                        <div key={item.q} className="grid gap-2 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12 border-t border-ink-200 py-5">
                            <dt className="font-medium text-ink-900">{item.q}</dt>
                            <dd className="text-ink-600 leading-relaxed max-w-[65ch]">{item.a}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="bg-white border-t border-ink-100">
                <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-ink-900">
                            {isEn ? 'Ready to explore your destiny?' : '準備好開始探索您的命運了嗎？'}
                        </h2>
                        <p className="mt-2 text-ink-600">
                            {isEn ? 'Try AI Zi Wei Dou Shu analysis now. Start free, upgrade anytime.' : '立即體驗 AI 紫微斗數命理分析，免費開始，隨時升級。'}
                        </p>
                    </div>
                    <Link href={analysisHref} className="btn-primary px-8 py-3 shrink-0">
                        {isEn ? 'Start analysis' : '立即開始分析'}
                    </Link>
                </div>
            </section>
        </main>
    );
}
