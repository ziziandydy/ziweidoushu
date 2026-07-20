import React from 'react';
import { DestinyInfo } from '../types';
import { AnalysisDict } from '../translations';

interface StarAnalysisProps {
    t: AnalysisDict;
    destinyInfo: DestinyInfo;
    onBack: () => void;
    onNext: () => void;
}

export default function StarAnalysis({ t, destinyInfo, onBack, onNext }: StarAnalysisProps) {

    const getEnergyColor = (energy: number) => {
        if (energy >= 80) return { color: 'bg-green-400', border: 'border-green-500' };
        if (energy >= 60) return { color: 'bg-yellow-400', border: 'border-yellow-500' };
        if (energy >= 40) return { color: 'bg-orange-400', border: 'border-orange-500' };
        return { color: 'bg-red-400', border: 'border-red-500' };
    };

    // /api/calculate returns energyLevel on a 0-100 scale; the raw engine uses
    // small integers (-1..2) — normalize the latter so the bars stay meaningful.
    const normalizeEnergy = (energy: number) => {
        if (energy > 10) return Math.min(Math.round(energy), 100);
        if (energy >= 2) return 90;
        if (energy >= 1) return 75;
        if (energy >= 0) return 50;
        return 30;
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">{t.stars.title}</h2>

            <div className="space-y-4">
                {destinyInfo.palaces.map((palace) => {
                    const palaceName = palace.palaceName;
                    const majorStarsDisplay = palace.majorStars.length > 0
                        ? palace.majorStars.map(s => s.name).join('、')
                        : t.stars.noMajorStar;
                    const description = t.stars.palaceDescription.replace('{palace}', palaceName);

                    const avgEnergy = palace.majorStars.length > 0
                        ? palace.majorStars.reduce((sum, star) => sum + (star.energyLevel || 50), 0) / palace.majorStars.length
                        : 50;
                    const normalizedEnergy = normalizeEnergy(avgEnergy);
                    const starColor = getEnergyColor(normalizedEnergy);

                    return (
                        <div key={palace.palaceIndex} className={`bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 ${starColor.border} p-4 rounded shadow-sm`}>
                            <h3 className="font-bold text-lg mb-2">{palaceName}</h3>
                            <p className="text-gray-700 mb-2">{description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{t.stars.majorStars}: {majorStarsDisplay}</span>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">{t.stars.energy}:</span>
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
                    {t.stars.back}
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200"
                >
                    {t.stars.next}
                </button>
            </div>
        </div>
    );
}
