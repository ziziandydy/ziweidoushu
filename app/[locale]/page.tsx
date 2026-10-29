import React from 'react';
import Link from 'next/link';
import HomeBirthForm from '../components/home/HomeBirthForm';
import LatestPosts from '../components/home/LatestPosts';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return [{ locale: 'zh-TW' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';
    return {
        title: isEn
            ? 'AI Zi Wei Dou Shu - Modern Chinese Astrology System'
            : 'AI 紫微斗數 - 現代化的命理分析系統',
        description: isEn
            ? 'Combining traditional Zhongzhou school theory with modern AI technology for accurate destiny analysis.'
            : '結合傳統中州派理論與現代 AI 技術，提供精準的命理分析。支援農曆西曆轉換，自動計算命盤，並提供 AI 深度解析。',
        openGraph: {
            images: [{ url: 'https://aiziwei.online/og-image.png', width: 1200, height: 630 }],
        },
        twitter: { card: 'summary_large_image', images: ['https://aiziwei.online/og-image.png'] },
        // 中文首頁以根網址為 canonical：/ 由 vercel.json rewrite 到 /zh-TW，兩者內容相同，
        // Google 也一直選根網址（www → apex 308 後即為 https://aiziwei.online/）
        alternates: {
            canonical: isEn ? 'https://aiziwei.online/en' : 'https://aiziwei.online/',
            languages: {
                'zh-TW': 'https://aiziwei.online/',
                'en': 'https://aiziwei.online/en',
                'x-default': 'https://aiziwei.online/',
            },
        },
    };
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    const isEn = locale === 'en';
    const analysisHref = `/${locale}/analysis`;
    const aboutHref = `/${locale}/about`;
    const currentYear = new Date().getFullYear();
    const strongCls = 'font-medium text-ink-900';

    const t = isEn ? {
        hero: {
            title: 'Cast your chart and read every palace',
            sub: 'Twelve palaces and major stars placed by Zhongzhou school rules, read with AI assistance under human supervision.',
            freeLabel: 'Free',
            freeText: '3 Q&A per month',
            paidLabel: 'NT$199',
            paidText: '1 hour of unlimited Q&A',
            formTitle: 'Enter your birth details',
            submit: 'Cast my chart',
        },
        steps: {
            heading: 'From chart to questions',
            intro: 'The free plan includes your chart and the first reading.',
            items: [
                { title: 'Chart', text: 'Enter your birth time and we place your twelve palaces and major stars using Zhongzhou school rules. Solar and lunar dates both work.' },
                { title: 'Reading', text: 'AI reads the brightness of your major stars, your chart pattern and your Life Palace, and gives you a first analysis.' },
                { title: 'Questions', text: 'Ask follow-up questions about your own chart: 3 free each month, or unlimited for 1 hour for NT$199.' },
            ],
        },
        latest: { heading: 'Latest articles', all: 'All articles' },
        about: {
            heading: 'About Zi Wei Dou Shu',
            card1Title: 'Historical Origins of Zi Wei Dou Shu',
            card1p1: <><strong className={strongCls}>Zi Wei Dou Shu</strong>, also known as "Purple Star Astrology", is one of the most important astrological systems in traditional Chinese divination. Its origins trace back to the <strong className={strongCls}>Tang Dynasty</strong>, founded by <strong className={strongCls}>Zhang Guo Lao</strong> and later developed by <strong className={strongCls}>Chen Xi Yi</strong> and others.</>,
            card1p2: <>It centers on the <strong className={strongCls}>Purple Star (Ziwei)</strong>, combining the <strong className={strongCls}>Twelve Palaces</strong>, <strong className={strongCls}>Fourteen Major Stars</strong>, <strong className={strongCls}>Six Auspicious Stars</strong>, <strong className={strongCls}>Six Inauspicious Stars</strong>, and the dynamic <strong className={strongCls}>Four Transformations</strong> (Wealth, Power, Fame, Obstruction), forming a complete destiny analysis system.</>,
            card1p3: <>Through the <strong className={strongCls}>Song, Yuan, Ming, and Qing</strong> dynasties, Zi Wei Dou Shu became one of the four major divination systems alongside <strong className={strongCls}>Ba Zi</strong>, <strong className={strongCls}>Face Reading</strong>, and <strong className={strongCls}>Feng Shui</strong>.</>,
            card2Title: 'Why the Zhongzhou School?',
            card2p: <>The Zhongzhou School (Heluo School) is one of the oldest and most rigorous lineages, rooted in classical Central Plains tradition. It emphasises <strong className={strongCls}>precise star energy rankings</strong>, the dynamic interplay of the <strong className={strongCls}>Four Transformations</strong>, and the systematic logic of <strong className={strongCls}>flying stars</strong>, giving our AI a clear logical basis for chart interpretation.</>,
        },
        faq: {
            heading: 'Frequently asked questions',
            items: [
                {
                    q: 'What is the difference between Zi Wei Dou Shu and Ba Zi?',
                    a: 'Zi Wei Dou Shu centres on stars and twelve palaces, excelling at nuanced personality analysis across life domains (wealth, career, relationships, etc.). Ba Zi uses Five Elements theory to map major luck cycles. Both have unique strengths and complement each other.',
                },
                {
                    q: 'How does the Zhongzhou School differ from other lineages?',
                    a: 'Rooted in classical Central Plains tradition, the Zhongzhou School emphasises precise star energy rankings, Four Transformation dynamics, and rigorous flying-star logic. Compared to modern derivative schools, it more faithfully preserves the traditional framework, which suits systematic study and AI-structured analysis.',
                },
                {
                    q: 'Who writes the articles on this website?',
                    a: 'Articles are AI-assisted and human-supervised. They draw on Zhongzhou school theory, the solar terms, the lunar calendar and current events, are written in plain language, and list their sources at the end. "Wang Laoshi" is the site\'s editorial pen name.',
                },
                {
                    q: 'How accurate is the AI analysis?',
                    a: 'Our system uses a leading AI language model combined with traditional Zhongzhou School theory. The AI systematically integrates chart combinations to provide objective reference. Destiny analysis is a cultural tradition, best used as a tool for self-understanding and finding your rhythm, not as absolute prediction.',
                },
                {
                    q: "What if I don't know my birth hour?",
                    a: 'An accurate Zi Wei Dou Shu chart requires the birth hour (each two-hour block is one time period). If uncertain, you can try the closest time period, cross-reference major life events to narrow it down, or consult an experienced astrologer.',
                },
                {
                    q: "What's the difference between blog articles and a personal reading?",
                    a: <span>Blog articles interpret current events, solar terms, and fortune trends from an astrological perspective, suitable for general reading and learning. For a personalised chart analysis based on your birth data, use the <Link href={analysisHref} className="link">Start Analysis</Link> feature.</span>,
                },
            ],
        },
        policy: {
            text: 'Blog articles are AI-assisted and human-supervised, with sources listed at the end.',
            about: 'About us',
            disclaimer: 'This service is for entertainment and cultural learning purposes only, and should not be used as the basis for important life decisions.',
        },
        footer: {
            copyright: `© ${currentYear} AI Zi Wei Dou Shu | Based on Traditional Zhongzhou School Theory`,
            privacy: 'Privacy Policy',
            pricing: 'Pricing',
            analysis: 'Start Analysis',
            about: 'About Us',
        },
    } : {
        hero: {
            title: '排出你的命盤，看懂每一宮',
            sub: '依中州派規則排出十二宮與主星，AI 輔助解讀，人工監督。',
            freeLabel: '免費',
            freeText: '每月 3 次問答',
            paidLabel: 'NT$ 199',
            paidText: '1 小時無限問答',
            formTitle: '輸入出生資料',
            submit: '排出命盤',
        },
        steps: {
            heading: '從排盤到問答',
            intro: '免費方案即包含排盤與初始解析。',
            items: [
                { title: '排盤', text: '輸入出生時間，依中州派排出十二宮與主星，支援農曆與西曆。' },
                { title: '解讀', text: 'AI 解析主星亮度、格局與命宮，給出初始分析。' },
                { title: '問答', text: '針對自己的命盤追問。每月 3 次免費，NT$ 199 可在 1 小時內無限次提問。' },
            ],
        },
        latest: { heading: '最新文章', all: '所有文章' },
        about: {
            heading: '關於紫微斗數',
            card1Title: '紫微斗數的歷史淵源',
            card1p1: <><strong className={strongCls}>紫微斗數</strong>，又稱「紫微命盤」，是中國傳統命理學中極為重要的占星術系統。其起源可追溯至<strong className={strongCls}>唐代</strong>，由<strong className={strongCls}>張果老</strong>所創立，後經由<strong className={strongCls}>陳希夷</strong>等人傳承發展。</>,
            card1p2: <>紫微斗數以<strong className={strongCls}>紫微星</strong>為核心，結合<strong className={strongCls}>十二宮位</strong>、<strong className={strongCls}>十四主星</strong>、<strong className={strongCls}>六吉星</strong>、<strong className={strongCls}>六煞星</strong>，以及<strong className={strongCls}>四化星</strong>（化祿、化權、化科、化忌）的動態變化，形成一套完整的命理分析體系。</>,
            card1p3: <>歷經<strong className={strongCls}>宋、元、明、清</strong>各朝的發展，紫微斗數逐漸成為與<strong className={strongCls}>八字</strong>、<strong className={strongCls}>面相</strong>、<strong className={strongCls}>風水</strong>並列的四大命理體系之一。</>,
            card2Title: '為什麼選擇中州派？',
            card2p: <>中州派（又稱河洛派）源自中原正統，是紫微斗數流傳最久、理論最嚴謹的主要流派之一。特別重視<strong className={strongCls}>星曜能量等級</strong>的精確評估、<strong className={strongCls}>四化星</strong>在宮位之間的動態互動，以及<strong className={strongCls}>飛星邏輯</strong>的系統推演。這套嚴謹的分析框架，使 AI 在解讀命盤時能夠有清晰的邏輯依據。</>,
        },
        faq: {
            heading: '常見問題',
            items: [
                {
                    q: '紫微斗數和八字有什麼不同？',
                    a: '紫微斗數以星曜和十二宮位為核心，擅長細膩的性格分析與各人生面向（財、官、夫妻、子女等）的立體解析；八字以五行生剋為基礎，著重大運流年的時間節點掌握。兩者各有專長，互為補充。',
                },
                {
                    q: '中州派和其他流派有何差異？',
                    a: '中州派源自中原正統，強調星曜能量等級、四化星互動與飛星邏輯的嚴謹推演，理論體系完整且脈絡清晰。相較於部分現代流派，中州派更忠實地傳承傳統架構，適合系統化學習與 AI 結構化解析。',
                },
                {
                    q: '網站的文章是由誰撰寫？',
                    a: '本網站的文章由 AI 輔助撰寫、人工監督。內容結合中州派命理理論與當下節氣、農曆時日和時事話題，以白話文撰寫，文末附上引用來源。署名「王老師」是本站的編輯筆名。',
                },
                {
                    q: 'AI 的分析準確嗎？',
                    a: '本系統採用主流 AI 語言模型，結合傳統中州派理論進行命盤解析。AI 能夠系統性地整合星盤組合，提供客觀參考。命理分析屬於文化傳統，適合作為認識自己、掌握節奏的參考工具，而非絕對預測。',
                },
                {
                    q: '不知道出生時辰怎麼辦？',
                    a: '紫微斗數命盤需要出生時辰才能準確排盤，每兩小時為一個時辰。若不確定，可嘗試最接近的時辰，或根據您的人生重要事件進行「校時」推算，也可諮詢有經驗的命理師協助確認。',
                },
                {
                    q: '部落格文章和算命有什麼不同？',
                    a: <span>部落格文章是以命理角度解析時事、節氣和運勢趨勢，適合一般閱讀與命理知識學習。若需要針對您個人出生資料的命盤分析，請使用<Link href={analysisHref} className="link">「開始分析命盤」</Link>功能。</span>,
                },
            ],
        },
        policy: {
            text: '部落格文章由 AI 輔助撰寫、人工監督，文末附引用來源。',
            about: '關於本站',
            disclaimer: '本服務僅供娛樂和文化學習參考，不應作為重要人生決策的依據。',
        },
        footer: {
            copyright: `© ${currentYear} AI 紫微斗數命盤計算系統 | 基於傳統中州派理論`,
            privacy: '隱私政策',
            pricing: '價格方案',
            analysis: '開始分析',
            about: '關於我們',
        },
    };

    const orgName = isEn ? 'AI Zi Wei Dou Shu' : 'AI 紫微斗數';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://aiziwei.online/#organization',
                name: orgName,
                url: 'https://aiziwei.online',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://aiziwei.online/favicon.svg',
                },
            },
            {
                '@type': 'WebSite',
                '@id': 'https://aiziwei.online/#website',
                name: orgName,
                url: 'https://aiziwei.online',
                inLanguage: isEn ? 'en' : 'zh-TW',
                publisher: { '@id': 'https://aiziwei.online/#organization' },
            },
            {
                '@type': 'SoftwareApplication',
                '@id': 'https://aiziwei.online/#app',
                name: orgName,
                url: 'https://aiziwei.online/' + locale + '/analysis',
                applicationCategory: 'LifestyleApplication',
                operatingSystem: 'Web',
                inLanguage: isEn ? 'en' : 'zh-TW',
                description: isEn
                    ? 'Zi Wei Dou Shu chart analysis based on the Zhongzhou school, powered by GPT-4o. Free plan: 3 Q&A per month.'
                    : '採用中州派理論、以 GPT-4o 驅動的紫微斗數命盤分析。免費方案每月 3 次問答。',
                publisher: { '@id': 'https://aiziwei.online/#organization' },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main>
                {/* Hero: the form is the first thing on the page */}
                <section className="bg-brand-50 border-b border-brand-100">
                    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
                        <div>
                            <h1 className="text-[2rem] sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-ink-900 [text-wrap:balance]">
                                {/* CJK can break between any two characters; keep each clause whole so 命盤 never splits */}
                                {t.hero.title.split(/(?<=，)/).map((part, i) => (
                                    <span key={i} className="inline-block">{part}</span>
                                ))}
                            </h1>
                            <p className="mt-5 text-lg text-ink-600 max-w-xl">{t.hero.sub}</p>
                            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-600">
                                <div className="flex gap-2"><dt className="font-medium text-ink-900">{t.hero.freeLabel}</dt><dd>{t.hero.freeText}</dd></div>
                                <div className="flex gap-2"><dt className="font-medium text-ink-900">{t.hero.paidLabel}</dt><dd>{t.hero.paidText}</dd></div>
                            </dl>
                        </div>
                        <HomeBirthForm locale={locale} title={t.hero.formTitle} submitLabel={t.hero.submit} />
                    </div>
                </section>

                {/* How it works: a real three-step sequence */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-14 grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12">
                        <div>
                            <h2 className="text-2xl font-bold text-ink-900">{t.steps.heading}</h2>
                            <p className="mt-3 text-ink-600">{t.steps.intro}</p>
                        </div>
                        <ol className="border-y border-ink-200 divide-y divide-ink-200">
                            {t.steps.items.map((step, i) => (
                                <li key={step.title} className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 gap-y-1 py-5">
                                    <span className="row-span-2 text-4xl font-bold leading-none text-brand-600 tabular-nums" aria-hidden="true">{i + 1}</span>
                                    <h3 className="text-lg font-bold text-ink-900">{step.title}</h3>
                                    <p className="text-ink-600">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <LatestPosts locale={locale} heading={t.latest.heading} allLabel={t.latest.all} />

                {/* About Zi Wei Dou Shu: existing copy, editorial layout */}
                <section id="about" className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-14 grid gap-8">
                        <h2 className="text-2xl font-bold text-ink-900">{t.about.heading}</h2>
                        <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 border-t border-ink-200 pt-6">
                            <h3 className="text-lg font-bold text-ink-900">{t.about.card1Title}</h3>
                            <div className="space-y-3 text-ink-600 leading-relaxed max-w-[65ch]">
                                <p>{t.about.card1p1}</p>
                                <p>{t.about.card1p2}</p>
                                <p>{t.about.card1p3}</p>
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 border-t border-ink-200 pt-6">
                            <h3 className="text-lg font-bold text-ink-900">{t.about.card2Title}</h3>
                            <p className="text-ink-600 leading-relaxed max-w-[65ch]">{t.about.card2p}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ: all answers visible, no accordion */}
                <section id="faq" className="max-w-6xl mx-auto px-4 py-14">
                    <h2 className="text-2xl font-bold text-ink-900 mb-6">{t.faq.heading}</h2>
                    <dl className="border-b border-ink-200">
                        {t.faq.items.map((item, i) => (
                            <div key={i} className="grid gap-2 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 border-t border-ink-200 py-5">
                                <dt className="font-medium text-ink-900">{item.q}</dt>
                                <dd className="text-ink-600 leading-relaxed max-w-[65ch]">{item.a}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Content policy and service disclaimer */}
                <section className="bg-white border-t border-ink-100">
                    <div className="max-w-6xl mx-auto px-4 py-6 grid gap-2 text-sm text-ink-600">
                        <p className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>{t.policy.text}</span>
                            <Link href={aboutHref} className="link">{t.policy.about}</Link>
                        </p>
                        <p className="text-ink-500">{t.policy.disclaimer}</p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-ink-100 bg-ink-50">
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-ink-500">
                    <p>{t.footer.copyright}</p>
                    <nav className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href={`/${locale}/privacy-policy`} className="hover:text-ink-900 transition-colors">{t.footer.privacy}</Link>
                        <Link href={`/${locale}/pricing`} className="hover:text-ink-900 transition-colors">{t.footer.pricing}</Link>
                        <Link href={analysisHref} className="hover:text-ink-900 transition-colors">{t.footer.analysis}</Link>
                        <Link href={aboutHref} className="hover:text-ink-900 transition-colors">{t.footer.about}</Link>
                    </nav>
                </div>
            </footer>
        </>
    );
}
