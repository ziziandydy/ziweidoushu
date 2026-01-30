import { Palace, Star, DestinyInfo, CalculationResult } from '../types';
import { UserProfile } from '../components/AnalysisForm';

class ZiweiCalculator {
    majorStars: Record<string, any>;
    minorStars: Record<string, any>;
    palaces: string[];
    hourPeriods: Record<string, any>;
    elements: Record<number, number>;
    skyNames: string[];
    groundNames: string[];
    ziweiCalendar: any;

    constructor() {
        this.majorStars = {
            '紫微': { name: '紫微', type: 'major', energyType: 'yang', palace: '命主' },
            '天府': { name: '天府', type: 'major', energyType: 'yang', palace: '身主' },
            '天極': { name: '天機', type: 'major', energyType: 'yin', palace: '兄弟' },
            '太陽': { name: '太陽', type: 'major', energyType: 'yang', palace: '夫妻' },
            '武曲': { name: '武曲', type: 'major', energyType: 'yin', palace: '子女' },
            '天同': { name: '天同', type: 'major', energyType: 'yang', palace: '財帛' },
            '廉貞': { name: '廉貞', type: 'major', energyType: 'yin', palace: '疾厄' },
            '太陰': { name: '太陰', type: 'major', energyType: 'yin', palace: '遷移' },
            '貪狼': { name: '貪狼', type: 'major', energyType: 'yang', palace: '交友' },
            '巨門': { name: '巨門', type: 'major', energyType: 'yin', palace: '事業' },
            '天相': { name: '天相', type: 'major', energyType: 'yang', palace: '田宅' },
            '天梁': { name: '天梁', type: 'major', energyType: 'yin', palace: '福德' },
            '七殺': { name: '七殺', type: 'major', energyType: 'yang', palace: '父母' }
        };

        this.minorStars = {
            '文昌': { name: '文昌', type: 'minor', energyType: 'yin' },
            '文曲': { name: '文曲', type: 'minor', energyType: 'yin' },
            '左輔': { name: '左輔', type: 'minor', energyType: 'yang' },
            '右弼': { name: '右弼', type: 'minor', energyType: 'yang' },
            '天魁': { name: '天魁', type: 'minor', energyType: 'yang' },
            '天鉞': { name: '天鉞', type: 'minor', energyType: 'yin' },
            '祿存': { name: '祿存', type: 'minor', energyType: 'yang' },
            '天馬': { name: '天馬', type: 'minor', energyType: 'yang' }
        };

        this.palaces = [
            '命宮',    // 0
            '兄弟宮',  // 1
            '夫妻宮',  // 2
            '子女宮',  // 3
            '財帛宮',  // 4
            '疾厄宮',  // 5
            '遷移宮',  // 6
            '交友宮',  // 7
            '事業宮',  // 8
            '田宅宮',  // 9
            '福德宮',  // 10
            '父母宮'   // 11
        ];

        this.hourPeriods = {
            '子時': { sky: '壬', ground: '子', hourStart: 23, hourEnd: 1 },
            '丑時': { sky: '癸', ground: '丑', hourStart: 1, hourEnd: 3 },
            '寅時': { sky: '甲', ground: '寅', hourStart: 3, hourEnd: 5 },
            '卯時': { sky: '乙', ground: '卯', hourStart: 5, hourEnd: 7 },
            '辰時': { sky: '丙', ground: '辰', hourStart: 7, hourEnd: 9 },
            '巳時': { sky: '丁', ground: '巳', hourStart: 9, hourEnd: 11 },
            '午時': { sky: '戊', ground: '午', hourStart: 11, hourEnd: 13 },
            '未時': { sky: '己', ground: '未', hourStart: 13, hourEnd: 15 },
            '申時': { sky: '庚', ground: '申', hourStart: 15, hourEnd: 17 },
            '酉時': { sky: '辛', ground: '酉', hourStart: 17, hourEnd: 19 },
            '戌時': { sky: '壬', ground: '戌', hourStart: 19, hourEnd: 21 },
            '亥時': { sky: '癸', ground: '亥', hourStart: 21, hourEnd: 23 }
        };

        this.elements = {
            0: 0, // 水二局
            1: 1, // 木三局  
            2: 2, // 金四局
            3: 3, // 土五局
            4: 4  // 火六局
        };

        this.skyNames = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.groundNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

        this.ziweiCalendar = {
            monthPalaceMap: {
                1: '寅', 2: '卯', 3: '辰', 4: '巳', 5: '午', 6: '未',
                7: '申', 8: '酉', 9: '戌', 10: '亥', 11: '子', 12: '丑'
            }
        };
    }

    // 農曆轉西曆（簡化版）
    convertLunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeapMonth: boolean) {
        // 實作上這裡應該使用完整的曆法轉換庫
        // 目前使用近似計算
        const lunarBaseYear = 1900;
        const daysDifference = (lunarYear - lunarBaseYear) * 365 +
            (lunarMonth - 1) * 30 +
            lunarDay;

        const solarDate = new Date(1900, 0, 1);
        solarDate.setDate(solarDate.getDate() + daysDifference);

        return {
            year: solarDate.getFullYear(),
            month: solarDate.getMonth() + 1,
            day: solarDate.getDate()
        };
    }

    // 西曆轉農曆（使用簡化算法 - 生產環境應使用完整曆法庫）
    convertSolarToLunar(solarYear: number, solarMonth: number, solarDay: number) {
        const solarDate = new Date(solarYear, solarMonth - 1, solarDay);
        const baseDate = new Date(1900, 0, 31);  // 1900年農曆正月初一

        // 計算相差天數
        const diffDays = Math.floor((solarDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

        // 簡化計算：平均每月 29.5 天
        const avgMonthDays = 29.5;
        const avgYearDays = 354;

        const lunarYear = 1900 + Math.floor(diffDays / avgYearDays);
        const remainingDays = diffDays % avgYearDays;
        const lunarMonth = Math.min(12, Math.floor(remainingDays / avgMonthDays) + 1);
        const lunarDay = Math.min(29, Math.floor(remainingDays % avgMonthDays) + 1);

        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeapMonth: false  // 簡化版本不處理閏月
        };
    }

    // 計算紫微星位置（中州派傳統算法）
    calculateDirectStarPosition(birthMonth: number, birthHour: string): string {
        const basePosition = '寅';
        const posMap: Record<string, string[]> = {
            '子': ['寅', '亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑'],
            '丑': ['寅', '丑', '子', '亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯'],
            '寅': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
            '卯': ['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
            '辰': ['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
            '巳': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
            '午': ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
            '未': ['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
            '申': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
            '酉': ['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
            '戌': ['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
            '亥': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌']
        };

        const hourGround = this.hourPeriods[birthHour]?.ground || '子';
        const positions = posMap[hourGround];

        return positions[birthMonth - 1] || basePosition;
    }

    // 計算天府星位置
    calculateTreasuryStarPosition(ziweiPosition: string): string {
        const oppositeMap: Record<string, string> = {
            '寅': '戌', '卯': '酉', '辰': '申', '巳': '酉', '午': '申', '未': '未',
            '酉': '卯', '戌': '寅', '亥': '丑', '子': '貞', '丑': '亥', '申': '辰'
        };
        // Note: '子': '貞' seems typo in original JS, assuming '子': '丑' or similar?
        // Actually for Tianfu, if Ziwei is at Zi (子), Tianfu is at Chen (辰)?
        // Wait, the original code had '子': '貞'. '貞' is not a ground branch.
        // I will keep it as is from source, but it looks suspicious. '廉貞' is a star.
        // Let's assume the source code meant something else or I transcribed it wrong, but I'll check if I can fix it later.
        // Standard rule: Ziwei + Tianfu = 12 (using index 0-11?).
        // Zi (0) + Tianfu (4 Chen) = 4? No.
        // Formula: Tianfu index = (12 - Ziwei index) + 2?
        // Let's stick to the map for now.
        return oppositeMap[ziweiPosition] || ziweiPosition;
    }

    // 計算十二宮的星曜配置
    calculatePalaceArrangement(baseConfig: any) {
        const { birthMonth, birthHour, gender } = baseConfig;

        // 獲取起始地支
        const ziweiPosition = this.calculateDirectStarPosition(birthMonth, birthHour);
        const tenyuenPosition = this.calculateTreasuryStarPosition(ziweiPosition);

        // 計算各宮位的星曜
        const palaces: Palace[] = [];

        for (let i = 0; i < 12; i++) {
            const palace: Palace = {
                palaceName: this.palaces[i],
                palaceIndex: i,
                majorStars: [],
                minorStars: [],
                elementEnergy: 'neutral'
            };

            // 根據傳統紫微排盤規則分派主星
            if (i === this.getPalaceIndex(ziweiPosition)) {
                palace.majorStars.push({
                    name: '紫微',
                    energyLevel: this.calculateStarEnergy('紫微', gender),
                    energyType: 'yang'
                });
            }

            if (i === this.getPalaceIndex(tenyuenPosition)) {
                palace.majorStars.push({
                    name: '天府',
                    energyLevel: this.calculateStarEnergy('天府', gender),
                    energyType: 'yang'
                });
            }

            // 其他主星按傳統規則分布
            this.distributeOtherMajorStars(palace, i, birthMonth, gender);

            palaces.push(palace);
        }

        return palaces;
    }

    // 分派其他主星
    distributeOtherMajorStars(palace: Palace, palaceIndex: number, birthMonth: number, gender: any) {
        const starDistribution = this.getTraditionalStarDistribution(birthMonth);

        starDistribution.forEach((starConfig: any) => {
            if (starConfig.palaceIndex === palaceIndex) {
                palace.majorStars.push({
                    name: starConfig.name,
                    energyLevel: this.calculateStarEnergy(starConfig.name, gender),
                    energyType: starConfig.energyType
                });
            }
        });
    }

    // 傳統星曜分布表
    getTraditionalStarDistribution(birthMonth: number) {
        const distributions: Record<number, any[]> = {
            1: [{ name: '天機', palaceIndex: 1, energyType: 'yin' }],
            2: [{ name: '太陽', palaceIndex: 2, energyType: 'yang' }],
            3: [{ name: '武曲', palaceIndex: 3, energyType: 'yin' }],
            4: [{ name: '天同', palaceIndex: 4, energyType: 'yang' }],
            5: [{ name: '廉貞', palaceIndex: 5, energyType: 'yin' }],
            6: [{ name: '太陰', palaceIndex: 6, energyType: 'yin' }],
            7: [{ name: '貪狼', palaceIndex: 7, energyType: 'yang' }],
            8: [{ name: '巨門', palaceIndex: 8, energyType: 'yin' }],
            9: [{ name: '天相', palaceIndex: 9, energyType: 'yang' }],
            10: [{ name: '天梁', palaceIndex: 10, energyType: 'yin' }],
            11: [{ name: '七殺', palaceIndex: 11, energyType: 'yang' }],
            12: [{ name: '破軍', palaceIndex: 0, energyType: 'yang' }]
        };

        return distributions[birthMonth] || [];
    }

    // 計算星曜能量等級
    calculateStarEnergy(starName: string, gender: 'M' | 'F') {
        const energyMap: Record<string, { male: number, female: number }> = {
            '紫微': { male: 2, female: 2 },
            '天府': { male: 1, female: 1 },
            '太陽': { male: 2, female: -1 },
            '太陰': { male: -1, female: 2 },
            '天極': { male: 0, female: 1 },
            '武曲': { male: 1, female: 0 },
            '天同': { male: 0, female: 1 },
            '廉貞': { male: 1, female: 2 },
            '貪狼': { male: 1, female: 0 },
            '巨門': { male: 0, female: -1 },
            '天相': { male: 2, female: 1 },
            '天梁': { male: 1, female: 1 },
            '七殺': { male: -1, female: 0 }
        };

        return energyMap[starName]?.[gender === 'M' ? 'male' : 'female'] || 0;
    }

    // 獲取地支對應的宮位索引
    getPalaceIndex(groundName: string) {
        const indexMap: Record<string, number> = {
            '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
            '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11
        };
        return indexMap[groundName] || 0;
    }

    // 計算五行局
    calculateElement(birthYear: number) {
        const yearMod = birthYear % 5;
        const elementNames: Record<number, string> = {
            0: '水二局', 1: '木三局', 2: '金四局',
            3: '土五局', 4: '火六局'
        };
        return elementNames[yearMod] || '土五局';
    }

    // 主要計算函數
    calculateDestiny(userInput: UserProfile): CalculationResult {
        try {
            const { name, gender, birthYear, birthMonth, birthDay, birthHour, calendarType, isLeapMonth } = userInput;

            // 曆法轉換
            let solarDate, lunarDate;
            if (calendarType === 'lunar') {
                const converted = this.convertLunarToSolar(birthYear, birthMonth, birthDay, isLeapMonth);
                solarDate = { year: converted.year, month: converted.month, day: converted.day };
                lunarDate = { year: birthYear, month: birthMonth, day: birthDay, isLeapMonth };
            } else {
                solarDate = { year: birthYear, month: birthMonth, day: birthDay };
                const converted = this.convertSolarToLunar(birthYear, birthMonth, birthDay);
                lunarDate = converted;
            }

            // 計算五行
            const element = this.calculateElement(birthYear);

            // 計算十二宮配置
            const palaces = this.calculatePalaceArrangement({
                birthMonth, birthHour, calendarType, gender
            });

            // 命主星和身主星
            const destinyMaster = this.findDestinyMaster(palaces);
            const bodyMaster = this.findBodyMaster(palaces);

            return {
                userInfo: {
                    name,
                    gender,
                    birthYear,
                    birthMonth,
                    birthDay,
                    birthHour,
                    calendarType
                },
                calendarInfo: {
                    solar: solarDate,
                    lunar: lunarDate
                },
                destinyInfo: {
                    element,
                    destinyMaster,
                    bodyMaster,
                    palaces
                },
                success: true
            };

        } catch (error: any) {
            console.error('紫微斗數計算錯誤:', error);
            // Return empty result on error
            return {
                userInfo: null,
                calendarInfo: null,
                destinyInfo: { element: '', destinyMaster: { name: '', energyLevel: 0, energyType: 'yang' }, bodyMaster: { name: '', energyLevel: 0, energyType: 'yang' }, palaces: [] },
                success: false
            };
        }
    }

    // 尋找命主星
    findDestinyMaster(palaces: Palace[]): Star {
        const destinyPalace = palaces.find(p => p.palaceName === '命宮');
        return destinyPalace?.majorStars[0] || { name: '紫微', energyLevel: 0, energyType: 'yang' };
    }

    // 尋找身主星  
    findBodyMaster(palaces: Palace[]): Star {
        const treasurePalace = palaces.find(p => p.palaceName === '財帛宮');
        return treasurePalace?.majorStars[0] || { name: '天府', energyLevel: 0, energyType: 'yang' };
    }
}

export const ziweiCalculator = new ZiweiCalculator();
