import Link from 'next/link';
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

    return (
        <main>
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                    {isEn ? '💰 Pricing' : '💰 價格方案'}
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    {isEn ? 'Choose the plan that fits your destiny analysis needs' : '選擇最適合您的紫微斗數命理分析方案'}
                </p>
            </section>

            <section className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎁</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{isEn ? 'Free Plan' : '免費方案'}</h2>
                            <div className="text-4xl font-bold text-green-600 mb-2">NT$ 0</div>
                            <p className="text-gray-600">{isEn ? 'Free forever' : '永久免費'}</p>
                        </div>
                        <div className="space-y-4 mb-8">
                            {freeFeatures.map((f) => (
                                <div key={f} className="flex items-start">
                                    <span className="text-green-500 mr-3 text-xl">✓</span>
                                    <span className="text-gray-700">{f}</span>
                                </div>
                            ))}
                        </div>
                        <Link href={analysisHref} className="block w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-all text-center">
                            {isEn ? 'Start now' : '立即開始使用'}
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white relative border-4 border-purple-400">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                {isEn ? '⭐ Recommended' : '⭐ 推薦方案'}
                            </span>
                        </div>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💎</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{isEn ? 'Paid Unlock Plan' : '付費解鎖方案'}</h2>
                            <div className="text-5xl font-bold mb-2">NT$ 199</div>
                            <p className="text-white/90">{isEn ? '1 hour of unlimited Q&A' : '1 小時無限問答'}</p>
                        </div>
                        <div className="space-y-4 mb-8">
                            {paidFeatures.map((f) => (
                                <div key={f} className="flex items-start">
                                    <span className="text-yellow-300 mr-3 text-xl">✓</span>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                        <Link href={analysisHref} className="block w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all text-center shadow-lg">
                            {isEn ? 'Go to analysis & unlock' : '前往分析頁面付費解鎖'}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
                        {isEn ? 'Plan Comparison' : '方案功能對比'}
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left">{isEn ? 'Feature' : '功能項目'}</th>
                                    <th className="px-6 py-4 text-center">{isEn ? 'Free' : '免費方案'}</th>
                                    <th className="px-6 py-4 text-center">{isEn ? 'Paid' : '付費方案'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'Chart calculation' : '命盤計算'}</td>
                                    <td className="px-6 py-4 text-center text-green-600">✓</td>
                                    <td className="px-6 py-4 text-center text-purple-600">✓</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'Initial AI analysis' : 'AI 初始解析'}</td>
                                    <td className="px-6 py-4 text-center text-green-600">✓</td>
                                    <td className="px-6 py-4 text-center text-purple-600">✓</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'Free Q&A sessions / month' : '每月免費問答次數'}</td>
                                    <td className="px-6 py-4 text-center">{isEn ? '3' : '3 次'}</td>
                                    <td className="px-6 py-4 text-center">{isEn ? '3' : '3 次'}</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'Q&A during paid session' : '付費時段問答次數'}</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center text-purple-600 font-bold">{isEn ? 'Unlimited' : '無限'}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'Continuous conversation' : '連續對話功能'}</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center text-purple-600">✓</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{isEn ? 'In-depth Q&A' : '深度問答'}</td>
                                    <td className="px-6 py-4 text-center text-gray-400">{isEn ? 'Limited' : '有限'}</td>
                                    <td className="px-6 py-4 text-center text-purple-600">{isEn ? 'Unlimited' : '無限'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-purple-600">
                        {isEn ? 'FAQ' : '常見問題'}
                    </h2>
                    <div className="space-y-6">
                        {faq.map((item) => (
                            <div key={item.q} className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.q}</h3>
                                <p className="text-gray-700 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        {isEn ? 'Ready to explore your destiny?' : '準備好開始探索您的命運了嗎？'}
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        {isEn ? (
                            <>Try AI Zi Wei Dou Shu analysis now<br />Start free, upgrade anytime</>
                        ) : (
                            <>立即體驗 AI 紫微斗數命理分析<br />免費開始，隨時升級</>
                        )}
                    </p>
                    <Link href={analysisHref} className="inline-block bg-white text-purple-600 px-10 py-5 rounded-lg text-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
                        {isEn ? '🚀 Start analysis' : '🚀 立即開始分析'}
                    </Link>
                </div>
            </section>
        </main>
    );
}
