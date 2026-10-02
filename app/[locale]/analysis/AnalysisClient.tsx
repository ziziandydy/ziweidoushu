"use client";

import React, { useEffect, useState } from 'react';
import AnalysisForm from './components/AnalysisForm';
import DestinyChart from './components/DestinyChart';
import StarAnalysis from './components/StarAnalysis';
import DetailedAnalysis from './components/DetailedAnalysis';
import { CalculationResult, UserProfile } from './types';
import { AnalysisDict } from './translations';
import { ChatMessage, PAYMENT_RESTORE_KEY } from './components/QASection';

interface RestoreState {
    userProfile?: UserProfile;
    calculationResult?: CalculationResult;
    chatHistory?: ChatMessage[];
    analysisSections?: { title: string; content: string[] }[];
}

interface AnalysisClientProps {
    locale: string;
    t: AnalysisDict;
}

export default function AnalysisClient({ locale, t }: AnalysisClientProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [destinyData, setDestinyData] = useState<CalculationResult | null>(null);
    const [restoredChat, setRestoredChat] = useState<ChatMessage[]>([]);
    const [restoredSections, setRestoredSections] = useState<{ title: string; content: string[] }[] | null>(null);

    // Returning from an ECPay payment lands on ?restore=true — resume where the user left off.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('restore') !== 'true') return;

        try {
            const stateJSON = sessionStorage.getItem(PAYMENT_RESTORE_KEY);
            if (!stateJSON) return;
            const state: RestoreState = JSON.parse(stateJSON);
            sessionStorage.removeItem(PAYMENT_RESTORE_KEY);

            if (state.userProfile && state.calculationResult) {
                setUserProfile(state.userProfile);
                setDestinyData(state.calculationResult);
                setRestoredChat(state.chatHistory || []);
                setRestoredSections(state.analysisSections || null);
                setCurrentStep(4);
            }
        } catch (error) {
            console.error('Failed to restore payment state:', error);
        }
    }, []);

    const handleCalculated = (profile: UserProfile, result: CalculationResult) => {
        setUserProfile(profile);
        setDestinyData(result);
        setRestoredChat([]);
        setRestoredSections(null);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const steps = [
        { id: 1, label: t.steps.step1 },
        { id: 2, label: t.steps.step2 },
        { id: 3, label: t.steps.step3 },
        { id: 4, label: t.steps.step4 },
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold gradient-text">{t.header.title}</h1>
                    <p className="text-gray-600 mt-2">{t.header.subtitle}</p>
                </div>

                {/* Intro */}
                {currentStep === 1 && (
                    <div className="max-w-2xl mx-auto bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-gray-700 leading-relaxed">{t.intro}</p>
                    </div>
                )}

                {/* Step Indicator */}
                <div className="flex justify-center mb-8 space-x-4">
                    {steps.map(step => (
                        <div key={step.id} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {step.id}
                            </div>
                            <span className={`ml-2 font-medium hidden md:block ${currentStep === step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center">
                    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
                        {currentStep === 1 && (
                            <AnalysisForm locale={locale} t={t} onCalculated={handleCalculated} />
                        )}

                        {currentStep === 2 && destinyData && userProfile && (
                            <DestinyChart
                                t={t}
                                destinyInfo={destinyData.destinyInfo}
                                userInfo={userProfile}
                                onStarAnalysisClick={() => goToStep(3)}
                            />
                        )}

                        {currentStep === 3 && destinyData && (
                            <StarAnalysis
                                t={t}
                                destinyInfo={destinyData.destinyInfo}
                                onBack={() => goToStep(2)}
                                onNext={() => goToStep(4)}
                            />
                        )}

                        {currentStep === 4 && destinyData && userProfile && (
                            <DetailedAnalysis
                                locale={locale}
                                t={t}
                                userProfile={userProfile}
                                destinyData={destinyData}
                                initialSections={restoredSections}
                                initialChatHistory={restoredChat}
                                onBack={() => goToStep(3)}
                            />
                        )}
                    </div>
                </div>

                {/* Footer disclaimer */}
                <div className="max-w-2xl mx-auto mt-8 text-center text-xs text-gray-500 space-y-2">
                    <p>
                        <strong>{t.footer.disclaimerTitle}</strong>：{t.footer.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}
