import React from 'react';
import { DestinyInfo } from '../types';

interface StarAnalysisProps {
    destinyInfo: DestinyInfo;
    onBack: () => void;
    onNext: () => void;
}

export default function StarAnalysis({ destinyInfo, onBack, onNext }: StarAnalysisProps) {

    const getEnergyColor = (energy: number) => {
        if (energy >= 80) return { color: 'bg-green-400', border: 'border-green-500' };
        if (energy >= 60) return { color: 'bg-yellow-400', border: 'border-yellow-500' };
        if (energy >= 40) return { color: 'bg-orange-400', border: 'border-orange-500' };
        return { color: 'bg-red-400', border: 'border-red-500' };
    };


    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">❤️ 命盤星曜分析</h2>

            <div className="space-y-4">
                {destinyInfo.palaces.map((palace) => {
                    const palaceName = palace.palaceName;
                    const majorStarsDisplay = palace.majorStars.length > 0
                        ? palace.majorStars.map(s => s.name).join('、')
                        : '無主星';
                    const description = `${palaceName}的星曜配置影響個人相關運勢`;

                    // Calculate average energy
                    const energy = palace.majorStars.length > 0
                        ? Math.floor(palace.majorStars.reduce((sum, star) => sum + (star.energyLevel || 50), 0) / palace.majorStars.length)
                        : 50; // Default for empty palace

                    // Map simplified energy levels (0, 1, 2) to percentage for display if needed
                    // In legacy code it used `star.energyLevel`. But in my calculator I see strict maps:
                    // male: 2, female: 1 etc.
                    // The legacy mock code used randomization `60 + random`.
                    // Real calculator (ported one) returns small integers (-1, 0, 1, 2).
                    // I need to scale them to 0-100 for visual consistency if I want to use the same bars.
                    // 2 -> 90%, 1 -> 70%, 0 -> 50%, -1 -> 30%?
                    // Let's normalize:
                    let normalizedEnergy = 50;
                    if (energy >= 2) normalizedEnergy = 90;
                    else if (energy >= 1) normalizedEnergy = 75;
                    else if (energy >= 0) normalizedEnergy = 50;
                    else normalizedEnergy = 30;

                    const starColor = getEnergyColor(normalizedEnergy);

                    return (
                        <div key={palace.palaceIndex} className={`bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 ${starColor.border} p-4 rounded shadow-sm`}>
                            <h3 className="font-bold text-lg mb-2">{palaceName}</h3>
                            <p className="text-gray-700 mb-2">{description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">主要星曜: {majorStarsDisplay}</span>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">能量:</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div className={`${starColor.color} h-2 rounded-full`} style={{ width: `${normalizedEnergy}%` }}></div>
                                    </div>
                                    <span className="text-xs ml-2">{normalizedEnergy}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                >
                    ← 返回命盤圖表
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-ziwei-purple bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200"
                >
                    詳細解析 →
                </button>
            </div>
        </div>
    );
}
