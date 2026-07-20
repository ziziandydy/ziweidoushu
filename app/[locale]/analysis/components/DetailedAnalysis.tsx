"use client";

import React, { useEffect, useState } from 'react';
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

    const getSectionIcon = (title: string) => {
        if (title.includes('主星')) return 'text-yellow-500';
        if (title.includes('格局')) return 'text-green-500';
        if (title.includes('命宮')) return 'text-blue-500';
        if (title.includes('總結')) return 'text-purple-500';
        return 'text-purple-500';
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
                {t.analysis.titleWithName.replace('{name}', userProfile.name)}
            </h2>

            {loading && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-lg flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                    <span className="text-purple-700 font-medium">{t.analysis.loading}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                    <h3 className="text-red-800 font-bold mb-2">{t.analysis.serviceUnavailable}</h3>
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => setRetryKey(k => k + 1)} className="mt-4 text-sm text-red-600 underline">
                        {t.analysis.retryButton}
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-6">
                    {analysisSections.map((section, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className={`${getSectionIcon(section.title)} text-lg mr-3`}>🌟</div>
                                <h3 className="text-xl font-bold text-purple-800">{section.title}</h3>
                            </div>
                            <div className="text-gray-800 leading-relaxed space-y-2">
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
                    className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                >
                    {t.analysis.back}
                </button>
            </div>
        </div>
    );
}
