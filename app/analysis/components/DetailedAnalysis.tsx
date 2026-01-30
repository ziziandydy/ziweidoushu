
import React, { useEffect, useState } from 'react';
import { UserProfile } from './AnalysisForm';
import { CalculationResult } from '../types';
import { aiService } from '../services/aiService';
import { formatAnalysisHTML } from '../utils/formatter';

interface DetailedAnalysisProps {
    userProfile: UserProfile;
    destinyData: CalculationResult;
    onBack: () => void;
}

export default function DetailedAnalysis({ userProfile, destinyData, onBack }: DetailedAnalysisProps) {
    const [loading, setLoading] = useState(true);
    const [analysisSections, setAnalysisSections] = useState<{ title: string, content: string[] }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const result = await aiService.requestAnalysis(userProfile, destinyData);
                if (result.success && result.analysis) {
                    const sections = formatAnalysisHTML(result.analysis);
                    setAnalysisSections(sections);
                } else {
                    setError(result.error || '分析失敗');
                }
            } catch (err: any) {
                setError(err.message || '發生錯誤');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [userProfile, destinyData]);

    const getSectionIcon = (title: string) => {
        if (title.includes('主星')) return 'text-yellow-500';
        if (title.includes('格局')) return 'text-green-500';
        if (title.includes('命宮')) return 'text-blue-500';
        if (title.includes('總結')) return 'text-purple-500';
        return 'text-purple-500';
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">📖 {userProfile.name}的命盤詳細解析</h2>

            {loading && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-lg flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                    <span className="text-purple-700 font-medium">AI 正在分析您的命盤，請稍候...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                    <h3 classNametext-red-800 font-bold mb-2>分析服務暫時無法使用</h3>
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-600 underline">重試</button>
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

            <div className="mt-8">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">💬 命盤問答 (Coming Soon)</h3>
                    <p className="text-gray-500">問答功能正在遷移中...</p>
                </div>
            </div>

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={onBack}
                    className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                >
                    ← 返回星曜分析
                </button>
            </div>
        </div>
    );
}
