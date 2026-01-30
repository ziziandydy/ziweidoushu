import React from 'react';
import { DestinyInfo, Palace, CalculationResult } from '../types';
import { UserProfile } from './AnalysisForm';

interface DestinyChartProps {
    destinyInfo: DestinyInfo;
    userInfo: UserProfile;
    onStarAnalysisClick: () => void;
}

export default function DestinyChart({ destinyInfo, userInfo, onStarAnalysisClick }: DestinyChartProps) {
    const palaceOrder = [
        '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
        '遷移', '交友', '事業', '田宅', '福德', '父母'
    ];

    const ageRanges = [
        '5-14', '15-24', '25-34', '35-44', '45-54', '55-64',
        '65-74', '75-84', '85-94', '95-104', '105-114', '115-124'
    ];

    // Grid mapping: 4x4 grid (0-15) to Palace Index (0-11)
    const palaceMapping = [
        11, 0, 1, 2,    // Row 1: 父母, 命宮, 兄弟, 夫妻
        10, -1, -1, 3,  // Row 2: 福德, Center, Center, 子女
        9, -1, -1, 4,   // Row 3: 田宅, Center, Center, 財帛
        8, 7, 6, 5      // Row 4: 事業, 交友, 遷移, 疾厄
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">📊 紫微斗數命盤圖</h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-4 gap-2 text-xs relative aspect-square md:aspect-auto">
                    {palaceMapping.map((palaceIndex, gridIndex) => {
                        // Render Center Info (Occupies center 2x2)
                        // We only render this once at specific grid index (e.g., 5) and span it
                        if (gridIndex === 5) {
                            return (
                                <div key="center-info" className="bg-white border-2 border-purple-300 p-4 rounded text-center col-span-2 row-span-2 flex flex-col justify-center items-center shadow-sm">
                                    <div className="font-bold text-purple-800 text-sm mb-2">命主身主</div>
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">命主</div>
                                            <div className="text-xl font-bold text-purple-600">{destinyInfo.destinyMaster?.name || '紫微'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">身主</div>
                                            <div className="text-xl font-bold text-purple-600">{destinyInfo.bodyMaster?.name || '天府'}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                        {userInfo.birthYear}年{userInfo.birthMonth}月{userInfo.birthDay}日<br />
                                        {userInfo.birthHour} {userInfo.gender === 'M' ? '男' : '女'}
                                    </div>
                                </div>
                            );
                        }

                        // Skip other center cells
                        if (palaceIndex === -1) return null;

                        const palace = destinyInfo.palaces.find(p => p.palaceIndex === palaceIndex);
                        const palaceName = palace?.palaceName || palaceOrder[palaceIndex];
                        const ageRange = ageRanges[palaceIndex] || '';

                        const majorStarsText = palace?.majorStars.map(s => s.name).join('') || '';

                        return (
                            <div key={gridIndex} className="bg-white border border-gray-300 p-2 rounded text-center flex flex-col justify-between h-24 md:h-32 shadow-sm hover:shadow-md transition-shadow cursor-default">
                                <div className="font-bold text-blue-800 text-xs mb-1">{palaceName}</div>
                                <div className="text-sm font-bold text-purple-600 mb-1 break-words">{majorStarsText || '-'}</div>
                                <div className="text-xs text-gray-500 mt-auto">{ageRange}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={onStarAnalysisClick}
                    className="flex-1 bg-ziwei-purple bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 shadow-md"
                >
                    星曜分析 →
                </button>
            </div>
        </div>
    );
}
