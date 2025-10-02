import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    Star,
    Moon,
    Sun,
    CloudSun,
    MapPin,
    Compass,
    Calendar,
    Clock,
    User,
    Sparkles
} from 'lucide-react';
import { DestinyBoard, DestinyConfigBuilder, DayTimeGround, ConfigType, Gender, Temple, MajorStar, MinorStar } from '../main';

// 命盤星座組件
interface ZodiacStarProps {
    star: MajorStar | MinorStar;
    description: string;
    energyLevel?: number;
    position?: string;
}

const ZodiacStar: React.FC<ZodiacStarProps> = ({ star, description, energyLevel, position }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getEnergyColor = (level: number) => {
        if (level >= 2) return '#10b981'; // green
        if (level >= 1) return '#3b82f6'; // blue
        if (level >= 0) return '#6b7280'; // gray
        if (level >= -1) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const getEnergyText = (level: number) => {
        if (level >= 2) return '旺';
        if (level >= 1) return '得地';
        if (level >= 0) return '平和';
        if (level >= -1) return '不得地';
        return '陷';
    };

    return (
        <div
            className={`p-4 rounded-lg border transition-all duration-300 
        ${isExpanded ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
        >
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Star
                            size={20}
                            color={energyLevel !== undefined ? getEnergyColor(energyLevel) : '#6b7280'}
                        />
                        {energyLevel !== undefined && (
                            <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: getEnergyColor(energyLevel) }}
                            >
                                {Math.abs(energyLevel)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{star.displayName}</h3>
                        {energyLevel !== undefined && (
                            <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: `${getEnergyColor(energyLevel)}20` }}
                            >
                                {getEnergyText(energyLevel)}
                            </span>
                        )}
                    </div>
                </div>
                <ChevronRight
                    className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
            </div>

            {isExpanded && (
                <div className="mt-4 text-sm text-gray-600 animate-fade-in">
                    <p>{description}</p>
                    {position && (
                        <p className="mt-2 text-blue-600 font-medium">位置：{position}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// 命盤互動主元件
const InteractiveZiweiChart: React.FC = () => {
    const [step, setStep] = useState(1);
    const [destinyBoard, setDestinyBoard] = useState<DestinyBoard | null>(null);
    const [userInfo, setUserInfo] = useState({
        name: '',
        gender: 'M',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        birthHour: '',
        weekDay: '',
        isLeapMonth: false,
        calendarType: 'lunar' as 'lunar' | 'solar'
    });

    // 紫微斗數星座資訊
    const zodiacInfo = [
        {
            name: '紫微星',
            description: '人生命運的主導星，代表個人的潛能和發展方向。'
        },
        {
            name: '天機星',
            description: '智慧與機遇之星，代表個人的聰明才智和機遇運勢。'
        },
        {
            name: '廉貞星',
            description: '事業與成就之星，反映個人的職業發展和成就潛力。'
        },
        {
            name: '天府星',
            description: '財富與穩定之星，象徵個人的財運和穩定性。'
        },
        {
            name: '太陽星',
            description: '領導與權威之星，代表個人的領導能力和外在表現。'
        },
        {
            name: '武曲星',
            description: '財運與行動之星，反映個人的財運和執行力。'
        }
    ];

    // 計算命盤
    const calculateDestinyBoard = () => {
        try {
            const [hour, minute] = userInfo.birthHour.split(':').map(Number);

            const config = userInfo.calendarType === 'lunar'
                ? DestinyConfigBuilder.withlunar({
                    year: parseInt(userInfo.birthYear),
                    month: parseInt(userInfo.birthMonth),
                    day: parseInt(userInfo.birthDay),
                    isLeapMonth: userInfo.isLeapMonth,
                    bornTimeGround: DayTimeGround.getByName(userInfo.weekDay),
                    configType: ConfigType.SKY,
                    gender: userInfo.gender === 'M' ? Gender.M : Gender.F,
                })
                : DestinyConfigBuilder.withSolar({
                    year: parseInt(userInfo.birthYear),
                    month: parseInt(userInfo.birthMonth),
                    day: parseInt(userInfo.birthDay),
                    bornTimeHour: hour,
                    bornTimeGround: DayTimeGround.getByName(userInfo.weekDay),
                    configType: ConfigType.SKY,
                    gender: userInfo.gender === 'M' ? Gender.M : Gender.F,
                });

            const board = new DestinyBoard(config);
            setDestinyBoard(board);
        } catch (error) {
            console.error('計算命盤錯誤:', error);
            alert('命盤計算出現錯誤，請檢查輸入資料');
        }
    };

    // 獲取宮位的主要星曜
    const getTempleStars = (destinyBoard: DestinyBoard, temple: Temple) => {
        const cell = destinyBoard.getCellByTemple(temple);
        return {
            majorStars: cell.majorStars,
            minorStars: cell.minorStars,
            energyLevels: cell.majorStars.map(star => destinyBoard.getMajorStarEnergyLevel(star))
        };
    };

    // 交互式步驟導航
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <User className="mr-2 text-blue-500" />
                            個人基本資料
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-medium">姓名</label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="請輸入您的姓名"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">性別</label>
                                <div className="flex space-x-2">
                                    {[
                                        { key: 'M', label: '男' },
                                        { key: 'F', label: '女' }
                                    ].map(gender => (
                                        <button
                                            key={gender.key}
                                            className={`flex-1 py-3 rounded-lg border transition-colors font-medium
                        ${userInfo.gender === gender.key
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            onClick={() => setUserInfo({ ...userInfo, gender: gender.key })}
                                        >
                                            {gender.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">曆法類型</label>
                            <div className="flex space-x-2">
                                {[
                                    { key: 'lunar', label: '農曆' },
                                    { key: 'solar', label: '西曆' }
                                ].map(calendar => (
                                    <button
                                        key={calendar.key}
                                        className={`flex-1 py-3 rounded-lg border transition-colors font-medium
                      ${userInfo.calendarType === calendar.key
                                                ? 'bg-green-500 text-white border-green-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        onClick={() => setUserInfo({ ...userInfo, calendarType: calendar.key as 'lunar' | 'solar' })}
                                    >
                                        {calendar.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-2 font-medium">出生年</label>
                                <select
                                    value={userInfo.birthYear}
                                    onChange={(e) => setUserInfo({ ...userInfo, birthYear: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">選擇年份</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year.toString()}>{year}年</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">出生月</label>
                                <select
                                    value={userInfo.birthMonth}
                                    onChange={(e) => setUserInfo({ ...userInfo, birthMonth: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">選擇月份</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                        <option key={month} value={month.toString()}>{month}月</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">出生日</label>
                                <select
                                    value={userInfo.birthDay}
                                    onChange={(e) => setUserInfo({ ...userInfo, birthDay: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <iframe src="data:text/html,<script>console.log('test')</script>" style={{ display: 'none' }}></iframe>
                                    <option value="">選擇日期</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                        <option key={day} value={day.toString()}>{day}日</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium flex items-center">
                                <Clock className="mr-1" />
                                出生時辰
                            </label>
                            <select
                                value={userInfo.weekDay}
                                onChange={(e) => setUserInfo({ ...userInfo, weekDay: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">選擇時辰</option>
                                {['子時', '丑時', '寅時', '卯時', '辰時', '巳時', '午時', '未時', '申時', '酉時', '戌時', '亥時'].map(hour => (
                                    <option key={hour} value={hour}>{hour}</option>
                                ))}
                            </select>

                            {userInfo.calendarType === 'lunar' && (
                                <div className="mt-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={userInfo.isLeapMonth}
                                            onChange={(e) => setUserInfo({ ...userInfo, isLeapMonth: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-600">是否為潤月出生</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            onClick={() => {
                                // 簡單的表單驗證
                                const requiredFields = ['name', 'birthYear', 'birthMonth', 'birthDay', 'weekDay'];
                                if (requiredFields.every(field => userInfo[field as keyof typeof userInfo] !== '')) {
                                    calculateDestinyBoard();
                                    setStep(2);
                                } else {
                                    alert('請填寫完整所有必需資訊');
                                }
                            }}
                        >
                            計算命盤 <Sparkles className="ml-2 inline" size={20} />
                        </button>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <Star className="mr-2 text-purple-500" />
                            您的命盤主要星曜
                        </h2>

                        {destinyBoard && (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {destinyBoard.cells.map((cell, index) => {
                                        if (cell.majorStars.length > 0) {
                                            const templeInfo = cell.temples.length > 0 ? `${cell.temples[0].displayName}` : `地支${cell.ground.displayName}`;
                                            return cell.majorStars.map((star, starIndex) => (
                                                <ZodiacStar
                                                    key={`${index}-${starIndex}`}
                                                    star={star}
                                                    description={`位於${templeInfo}，是您命盤中的重要星曜。`}
                                                    energyLevel={destinyBoard.getMajorStarEnergyLevel(star)}
                                                    position={templeInfo}
                                                />
                                            ));
                                        }
                                        return null;
                                    }).filter(Boolean).slice(0, 9)}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2 text-blue-800">命盤基本資訊</h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p><span className="font-medium">命主星：</span>{destinyBoard.destinyMaster.displayName}</p>
                                            <p><span className="font-medium">身主星：</span>{destinyBoard.bodyMaster.displayName}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">五行屬性：</span>{destinyBoard.element.displayName}</p>
                                            <p><span className="font-medium">起運宮位：</span>{destinyBoard.startControl.displayName}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between">
                            <button
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={() => setStep(1)}
                            >
                                上一步
                            </button>
                            <button
                                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                onClick={() => setStep(3)}
                            >
                                查看詳細命盤
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <Compass className="mr-2 text-green-500" />
                            {userInfo.name}的命盤詳細解析
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="flex items-center mb-3">
                                    <MapPin className="mr-2 text-blue-500" />
                                    <h3 className="font-bold text-lg">基本資訊</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">姓名：</span>{userInfo.name}</p>
                                    <p><span className="font-medium">性別：</span>{userInfo.gender === 'M' ? '男' : '女'}</p>
                                    <p><span className="font-medium">出生：</span>{`${userInfo.birthYear}年${userInfo.birthMonth}月${userInfo.birthDay}日 ${userInfo.weekDay}`}</p>
                                    <p><span className="font-medium">曆法：</span>{userInfo.calendarType === 'lunar' ? '農曆' : '西曆'}</p>
                                    {destinyBoard && (
                                        <>
                                            <p><span className="font-medium">命主星：</span>{destinyBoard.destinyMaster.displayName}</p>
                                            <p><span className="font-medium">身主星：</span>{destinyBoard.bodyMaster.displayName}</p>
                                            <p><span className="font-medium">五行：</span>{destinyBoard.element.displayName}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="flex items-center mb-3">
                                    <Sun className="mr-2 text-yellow-500" />
                                    <h3 className="font-bold text-lg">運勢概述</h3>
                                </div>
                                <div className="text-sm space-y-2">
                                    <p>您的命盤顯示出豐富的個人特質和發展潛能。</p>
                                    <p>通過紫微斗數的傳統智慧，可以更深入了解您的人生軌跡。</p>
                                    <p>建議保持開放的心態，善用自身優勢創造美好人生。</p>
                                </div>
                            </div>
                        </div>

                        {destinyBoard && (
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="flex items-center mb-4">
                                    <CloudSun className="mr-2 text-purple-500" />
                                    <h3 className="font-bold text-lg">十二宮配置</h3>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Temple.LOOP_TEMPLES.map(temple => {
                                        try {
                                            const cell = destinyBoard.getCellByTemple(temple);
                                            const majorStarsStr = cell.majorStars.length > 0
                                                ? cell.majorStars.map(star => `${star.displayName}(${destinyBoard.getMajorStarEnergyLevel(star)})`).join('、')
                                                : '無主星';
                                            return (
                                                <div key={temple.key} className="p-3 bg-gray-50 rounded-lg text-sm">
                                                    <div className="font-medium text-blue-700">{temple.displayName}</div>
                                                    <div className="text-gray-600 mt-1">{majorStarsStr}</div>
                                                </div>
                                            );
                                        } catch {
                                            return (
                                                <div key={temple.key} className="p-3 bg-gray-50 rounded-lg text-sm">
                                                    <div className="font-medium text-blue-700">{temple.displayName}</div>
                                                    <div className="text-gray-600 mt-1">無法確定</div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={() => setStep(2)}
                            >
                                返回上一步
                            </button>
                            <button
                                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                onClick={() => {
                                    setDestinyBoard(null);
                                    setStep(1);
                                }}
                            >
                                重新查詢
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-3">
                        <Moon className="text-purple-500" size={32} />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            紫微斗數命盤
                        </h1>
                        <Sun className="text-yellow-500" size={32} />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-4">
                        {[1, 2, 3].map((stepNum) => (
                            <div
                                key={stepNum}
                                className={`flex items-center ${stepNum <= step ? 'text-blue-600' : 'text-gray-400'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNum <= step
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {stepNum}
                                </div>
                                {stepNum < 3 && (
                                    <div
                                        className={`w-16 h-0.5 mx-2 ${stepNum < step ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {renderStep()}

                <div className="mt-8 text-center text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                    <p className="flex items-center justify-center">
                        <Calendar className="mr-1" size={16} />
                        命盤解析基於傳統中州派紫微斗數理論，僅供參考 •
                    </p>
                    <p className="mt-1">Copyright (c) 2022 Airic Yu | Maintained by iTubai</p>
                </div>
            </div>
        </div>
    );
};

export default InteractiveZiweiChart;

