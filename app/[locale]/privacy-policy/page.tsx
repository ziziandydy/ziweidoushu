import Link from 'next/link';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';
    const otherLocale = isEn ? 'zh-TW' : 'en';

    return {
        title: isEn
            ? 'Privacy Policy | AI Zi Wei Dou Shu'
            : '隱私政策 - AI 紫微斗數 | 資料保護與隱私權說明',
        description: isEn
            ? 'How AI Zi Wei Dou Shu collects, uses, and protects your personal data. Chart data is kept only for the browser session.'
            : 'AI 紫微斗數的隱私政策說明，詳細說明我們如何收集、使用和保護您的個人資料。命盤數據僅在瀏覽器會話期間保留，重視用戶隱私權。',
        alternates: {
            canonical: `https://aiziwei.online/${locale}/privacy-policy`,
            languages: {
                [locale]: `https://aiziwei.online/${locale}/privacy-policy`,
                [otherLocale]: `https://aiziwei.online/${otherLocale}/privacy-policy`,
            },
        },
    };
}

export default async function PrivacyPolicyPage({ params }: Props) {
    const { locale } = await params;
    const isEn = locale === 'en';
    const homeHref = `/${locale}`;

    if (isEn) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
                    <h1 className="text-4xl font-bold text-purple-600 mb-4">Privacy Policy</h1>
                    <Link href={homeHref} className="inline-flex items-center text-purple-600 hover:underline mt-4">
                        ← Back to home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p className="text-sm text-blue-800"><strong>Last updated:</strong> October 2024</p>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Overview</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">Welcome to AI Zi Wei Dou Shu (the &quot;Service&quot;). We take your privacy seriously and are committed to protecting your personal information.</p>
                        <p className="text-gray-700 leading-relaxed">This privacy policy explains how we collect, use, store, and protect your personal information. By using the Service, you agree to the terms of this policy.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Information you provide</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li><strong>Basic details:</strong> name, gender, date and time of birth</li>
                            <li><strong>Calendar preference:</strong> lunar or solar calendar</li>
                            <li><strong>Q&A content:</strong> questions you ask the AI advisor</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Automatically collected information</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Device info:</strong> browser type, OS, device type</li>
                            <li><strong>Usage data:</strong> visit times, page views, feature usage</li>
                            <li><strong>IP address:</strong> used for security and service optimization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Provide the service:</strong> calculate your destiny chart and provide AI analysis</li>
                            <li><strong>Improve experience:</strong> optimize the interface and service quality</li>
                            <li><strong>Security:</strong> prevent abuse and protect system integrity</li>
                            <li><strong>Support:</strong> resolve technical issues and provide customer service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Third-Party Services</h2>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 Google services</h3>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p className="text-yellow-800 text-sm"><strong>Important:</strong> This site uses Google services including AdSense and Analytics. Google may set and read cookies in your browser.</p>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li><strong>Google AdSense:</strong> displays relevant ads and improves user experience</li>
                            <li><strong>Google Analytics:</strong> analyzes site usage to optimize the service</li>
                            <li><strong>Google Tag Manager:</strong> manages tracking tags</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">You can learn how Google uses data here:</p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google Privacy Policy</a>
                            <br />
                            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">How Google uses data from partner sites</a>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.2 Other third-party services</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>OpenAI API:</strong> provides AI destiny analysis</li>
                            <li><strong>Vercel:</strong> hosting and CDN</li>
                            <li><strong>Groundhog Analytics:</strong> site analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies and Similar Technologies</h2>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Cookies we use</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li><strong>Essential cookies:</strong> keep the site functioning</li>
                            <li><strong>Preference cookies:</strong> remember your settings</li>
                            <li><strong>Analytics cookies:</strong> understand site usage</li>
                            <li><strong>Advertising cookies:</strong> show relevant ads</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Third-party cookies</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">Google and other third-party providers may set cookies on your device to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Show personalized ads</li>
                            <li>Analyze site traffic</li>
                            <li>Improve user experience</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">5.3 Managing cookies</h3>
                        <p className="text-gray-700 leading-relaxed">You can manage cookies in your browser settings. Disabling some cookies may affect site functionality.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">We take the following measures to protect your data:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Encrypted transmission:</strong> HTTPS for data in transit</li>
                            <li><strong>Secure storage:</strong> data stored on secure servers</li>
                            <li><strong>Access control:</strong> restricted access to data</li>
                            <li><strong>Regular updates:</strong> keeping security measures current</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">How long we retain your data:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Chart data:</strong> kept only for the browser session</li>
                            <li><strong>Q&A history:</strong> retained for up to 1 hour (for continuous conversation)</li>
                            <li><strong>Usage statistics:</strong> retained anonymized for analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal data:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Access:</strong> know what data we hold about you</li>
                            <li><strong>Correction:</strong> correct inaccurate data</li>
                            <li><strong>Deletion:</strong> request deletion of your data</li>
                            <li><strong>Restriction:</strong> restrict our processing of your data</li>
                            <li><strong>Objection:</strong> object to our processing of your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Children&apos;s Privacy</h2>
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                            <p className="text-orange-800"><strong>Important:</strong> This Service is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will delete it promptly.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">10. International Data Transfers</h2>
                        <p className="text-gray-700 leading-relaxed">Your data may be transferred to and processed in countries other than your own. We ensure all international transfers comply with applicable data protection laws.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Policy Updates</h2>
                        <p className="text-gray-700 leading-relaxed">We may update this privacy policy from time to time. Material changes will be announced on the site or via email. Continued use of the Service means you accept the updated policy.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">If you have questions or concerns about this privacy policy, contact us:</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">
                                <strong>Website:</strong> <a href="https://aiziwei.online/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://aiziwei.online/</a><br />
                                <strong>Email:</strong> <a href="mailto:andismtu@gmail.com" className="text-blue-600 hover:text-blue-800">andismtu@gmail.com</a><br />
                                <strong>Support form:</strong> <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://forms.gle/KnwbQqyRGBVFqBPQ6</a>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Disclaimer</h2>
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-red-800 text-sm"><strong>Important:</strong> The Zi Wei Dou Shu readings provided by this Service are for entertainment and cultural learning purposes only, and should not be relied upon for important life decisions. Accuracy is not guaranteed — please treat results rationally.</p>
                        </div>
                    </section>
                </div>

                <div className="text-center mt-8 mb-8">
                    <Link href={homeHref} className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        ← Back to AI Zi Wei Dou Shu
                    </Link>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} AI Zi Wei Dou Shu | Based on the Zhongzhou school</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
                <h1 className="text-4xl font-bold text-purple-600 mb-4">隱私政策</h1>
                <p className="text-gray-600">Privacy Policy</p>
                <Link href={homeHref} className="inline-flex items-center text-purple-600 hover:underline mt-4">
                    ← 返回首頁
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-sm text-blue-800"><strong>最後更新日期：</strong>2024年10月</p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 概述</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">歡迎使用紫微斗數命盤計算系統（以下簡稱「本服務」）。我們重視您的隱私權，並致力於保護您的個人信息。</p>
                    <p className="text-gray-700 leading-relaxed">本隱私政策說明我們如何收集、使用、存儲和保護您的個人信息。使用本服務即表示您同意本政策的條款。</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 我們收集的信息</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 您主動提供的信息</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>基本資料：</strong>姓名、性別、出生年月日時</li>
                        <li><strong>曆法偏好：</strong>農曆或西曆選擇</li>
                        <li><strong>問答內容：</strong>您向 AI 命理師提出的問題</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 自動收集的信息</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>設備信息：</strong>瀏覽器類型、操作系統、設備類型</li>
                        <li><strong>使用數據：</strong>訪問時間、頁面瀏覽、功能使用情況</li>
                        <li><strong>IP 地址：</strong>用於安全防護和服務優化</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 信息使用目的</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">我們使用收集的信息用於以下目的：</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>提供服務：</strong>計算紫微斗數命盤、提供 AI 命理解析</li>
                        <li><strong>改善體驗：</strong>優化用戶界面、提升服務品質</li>
                        <li><strong>安全防護：</strong>防止濫用、保護系統安全</li>
                        <li><strong>技術支援：</strong>解決技術問題、提供客戶服務</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 第三方服務</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 Google 服務</h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-yellow-800 text-sm"><strong>重要：</strong>本網站使用 Google 服務，包括 AdSense 和 Analytics。Google 可能會在您的瀏覽器中設置和讀取 cookies。</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Google AdSense：</strong>顯示相關廣告，改善用戶體驗</li>
                        <li><strong>Google Analytics：</strong>分析網站使用情況，優化服務</li>
                        <li><strong>Google Tag Manager：</strong>管理追蹤代碼和標籤</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mb-4">您可以通過以下方式了解 Google 如何使用數據：</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google 隱私政策</a>
                        <br />
                        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google 如何使用合作夥伴網站或應用程式中的數據</a>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.2 其他第三方服務</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>OpenAI API：</strong>提供 AI 命理解析服務</li>
                        <li><strong>Vercel：</strong>網站託管和 CDN 服務</li>
                        <li><strong>Groundhog Analytics：</strong>網站分析服務</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies 和類似技術</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 我們使用的 Cookies</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>必要 Cookies：</strong>維持網站基本功能</li>
                        <li><strong>偏好 Cookies：</strong>記住您的設置和偏好</li>
                        <li><strong>分析 Cookies：</strong>了解網站使用情況</li>
                        <li><strong>廣告 Cookies：</strong>顯示相關廣告</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 第三方 Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">Google 和其他第三方服務提供商可能會在您的設備上設置 cookies。這些 cookies 用於：</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>顯示個性化廣告</li>
                        <li>分析網站流量</li>
                        <li>改善用戶體驗</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">5.3 如何管理 Cookies</h3>
                    <p className="text-gray-700 leading-relaxed">您可以通過瀏覽器設置管理 cookies。請注意，禁用某些 cookies 可能會影響網站功能。</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 數據安全</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">我們採取以下措施保護您的數據：</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>加密傳輸：</strong>使用 HTTPS 保護數據傳輸</li>
                        <li><strong>安全存儲：</strong>數據存儲在安全的伺服器上</li>
                        <li><strong>訪問控制：</strong>限制數據訪問權限</li>
                        <li><strong>定期更新：</strong>保持安全措施的最新狀態</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">7. 數據保留</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">我們保留您的數據的時間：</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>命盤數據：</strong>僅在瀏覽器會話期間保留</li>
                        <li><strong>問答記錄：</strong>最多保留 1 小時（用於連續對話）</li>
                        <li><strong>使用統計：</strong>匿名化後保留用於分析</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">8. 您的權利</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">您對個人數據享有以下權利：</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>訪問權：</strong>了解我們收集了哪些關於您的數據</li>
                        <li><strong>更正權：</strong>更正不準確的個人數據</li>
                        <li><strong>刪除權：</strong>要求刪除您的個人數據</li>
                        <li><strong>限制權：</strong>限制我們處理您的數據</li>
                        <li><strong>反對權：</strong>反對我們處理您的數據</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">9. 兒童隱私保護</h2>
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                        <p className="text-orange-800"><strong>重要聲明：</strong>本服務不針對 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人信息。</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">如果您是 13 歲以下兒童的家長或監護人，並發現您的孩子向我們提供了個人信息，請聯繫我們，我們將立即刪除這些信息。</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">10. 國際數據傳輸</h2>
                    <p className="text-gray-700 leading-relaxed">您的數據可能會被傳輸到您所在國家/地區以外的地方進行處理。我們確保所有國際數據傳輸都符合適用的數據保護法律。</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">11. 政策更新</h2>
                    <p className="text-gray-700 leading-relaxed">我們可能會不時更新本隱私政策。重大變更將通過網站公告或電子郵件通知您。繼續使用本服務即表示您接受更新後的政策。</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">12. 聯繫我們</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">如果您對本隱私政策有任何疑問，請通過以下方式聯繫我們：</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            <strong>網站：</strong> <a href="https://aiziwei.online/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://aiziwei.online/</a><br />
                            <strong>郵件：</strong> <a href="mailto:andismtu@gmail.com" className="text-blue-600 hover:text-blue-800">andismtu@gmail.com</a><br />
                            <strong>客服表單：</strong> <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://forms.gle/KnwbQqyRGBVFqBPQ6</a>
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">13. 免責聲明</h2>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-red-800 text-sm"><strong>重要提醒：</strong>本服務提供的紫微斗數命理解析僅供娛樂和文化學習參考，不應作為重要人生決策的依據。命理結果不保證準確性，請理性對待。</p>
                    </div>
                </section>
            </div>

            <div className="text-center mt-8 mb-8">
                <Link href={homeHref} className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    ← 返回紫微斗數命盤
                </Link>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} 紫微斗數命盤計算系統 | 基於傳統中州派理論</p>
            </div>
        </main>
    );
}
