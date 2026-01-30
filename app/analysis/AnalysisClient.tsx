"use client";

import React, { useState } from 'react';
import AnalysisForm, { UserProfile } from './components/AnalysisForm';
import DestinyChart from './components/DestinyChart';
import StarAnalysis from './components/StarAnalysis';
import DetailedAnalysis from './components/DetailedAnalysis';
import { ziweiCalculator } from './utils/calculator';
import { CalculationResult } from './types';

export default function AnalysisClient() {
    const [currentStep, setCurrentStep] = useState(1);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [destinyData, setDestinyData] = useState<CalculationResult | null>(null);

    const handleFormSubmit = (profile: UserProfile) => {
        setUserProfile(profile);
        const result = ziweiCalculator.calculateDestiny(profile);
        if (result.success) {
            setDestinyData(result);
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('計算失敗，請檢查資料');
        }
    };

    const steps = [
        { id: 1, label: '基本資料' },
        { id: 2, label: '命盤圖表' },
        { id: 3, label: '命盤星曜' },
        { id: 4, label: '詳細解析' }
    ];

    return (
        <div className="min-h-screen pt-16 bg-gray-100">
            {/* Step Indicator */}
            <div className="container mx-auto px-4 py-6">
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
                            <AnalysisForm onSubmit={handleFormSubmit} />
                        )}

                        {currentStep === 2 && destinyData && userProfile && (
                            <DestinyChart
                                destinyInfo={destinyData.destinyInfo}
                                userInfo={userProfile}
                                onStarAnalysisClick={() => {
                                    setCurrentStep(3);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}

                        {currentStep === 3 && destinyData && (
                            <StarAnalysis
                                destinyInfo={destinyData.destinyInfo}
                                onBack={() => setCurrentStep(2)}
                                onNext={() => {
                                    setCurrentStep(4);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}

                        {currentStep === 4 && destinyData && userProfile && (
                            <DetailedAnalysis
                                userProfile={userProfile}
                                destinyData={destinyData}
                                onBack={() => setCurrentStep(3)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
