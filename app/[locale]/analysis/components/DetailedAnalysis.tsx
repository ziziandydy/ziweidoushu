"use client";

import React, { useEffect, useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { CalculationResult, UserProfile } from '../types';
import { AnalysisDict } from '../translations';
import { requestAnalysis } from '../services/aiService';
import { formatAnalysisHTML } from '../utils/formatter';
import QASection, { ChatMessage } from './QASection';

interface DetailedAnalysisProps {
    locale: string;
    t: AnalysisDict;
    userProfile: UserProfile;
    destinyData: CalculationResult;
    initialSections: { title: string; content: string[] }[] | null;
    initialChatHistory: ChatMessage[];
    onBack: () => void;
}

export default function DetailedAnalysis({
    locale, t, userProfile, destinyData, initialSections, initialChatHistory, onBack,
}: DetailedAnalysisProps) {
    const [loading, setLoading] = useState(!initialSections);
    const [analysisSections, setAnalysisSections] = useState<{ title: string, content: string[] }[]>(initialSections || []);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        // Restored from a payment redirect — the analysis was already generated
        if (initialSections && retryKey === 0) return;

        let cancelled = false;
        const fetchAnalysis = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await requestAnalysis(userProfile, destinyData.raw, locale);
                if (cancelled) return;
                if (result.success && result.analysis) {
                    setAnalysisSections(formatAnalysisHTML(result.analysis));
                } else {
                    setError(result.error || t.analysis.serviceUnavailable);
                }
            } catch (err: any) {
                if (!cancelled) setError(err.message || t.analysis.serviceUnavailable);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAnalysis();
        return () => { cancelled = true; };
    }, [userProfile, destinyData, retryKey]);

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-ink-900">
                {t.analysis.titleWithName.replace('{name}', userProfile.name)}
            </h2>

            {loading && (
                <div className="bg-brand-50 border border-brand-100 p-6 rounded-xl flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mr-3"></div>
                    <span className="text-brand-700 font-medium">{t.analysis.loading}</span>
                </div>
            )}

            {error && (
                <div role="alert" className="bg-white border border-danger/30 p-6 rounded-xl">
                    <h3 className="error-text font-bold mb-2"><WarningCircle size={20} weight="fill" className="mt-px shrink-0" aria-hidden="true" />{t.analysis.serviceUnavailable}</h3>
                    <p className="text-ink-700">{error}</p>
                    <button onClick={() => setRetryKey(k => k + 1)} className="mt-4 link text-sm">
                        {t.analysis.retryButton}
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-6">
                    {analysisSections.map((section, idx) => (
                        <div key={idx} className="bg-white border border-ink-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-ink-900 mb-4 pb-3 border-b border-ink-100">{section.title}</h3>
                            <div className="text-ink-800 leading-relaxed space-y-2">
                                {section.content.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <QASection
                locale={locale}
                t={t}
                userProfile={userProfile}
                destinyData={destinyData}
                initialMessages={initialChatHistory}
                analysisSections={analysisSections}
            />

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={onBack}
                    className="btn-secondary w-full py-3"
                >
                    {t.analysis.back}
                </button>
            </div>
        </div>
    );
}
