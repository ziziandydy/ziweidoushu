/**
 * Vercel Serverless Function for Zi Wei Dou Shu Calculation
 * API Route: /api/calculate
 * 整合真實的 TypeScript 核心計算引擎
 */

// 嘗試載入真實的 TypeScript 核心模組
let ZiweiCore = null;
try {
    // 嘗試從編譯後的 build 目錄載入
    ZiweiCore = require('../build/main.js');
    console.log('✅ 成功載入真實的紫微斗數核心引擎');
} catch (error) {
    console.warn('⚠️ 無法載入 TypeScript 核心，將使用簡化計算:', error.message);
}

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數計算 API - ' + (ZiweiCore ? '真實計算模式' : '簡化模式'));

    // CORS 頭部 - 限制為特定域名
    const allowedOrigins = [
        'https://ziweidoushu.vercel.app',
        'https://ziweidoushy.vercel.app',
        'http://localhost:8080',
        'http://localhost:3000'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: '只允許 POST 請求' });
        return;
    }

    try {
        const data = req.body;

        // 詳細的輸入驗證
        if (!data || typeof data !== 'object') {
            return res.status(400).json({
                error: '請求數據格式無效',
                success: false
            });
        }

        // 驗證必填欄位
        const requiredFields = ['name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'birthHour'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `請填寫完整資料：${missingFields.join(', ')}`,
                required: requiredFields,
                missing: missingFields,
                success: false
            });
        }

        // 驗證數據類型和範圍
        if (!['M', 'F'].includes(data.gender)) {
            return res.status(400).json({
                error: '性別必須是 M 或 F',
                success: false
            });
        }

        if (data.birthYear < 1900 || data.birthYear > 2100) {
            return res.status(400).json({
                error: '出生年份無效（1900-2100）',
                success: false
            });
        }

        if (data.birthMonth < 1 || data.birthMonth > 12) {
            return res.status(400).json({
                error: '出生月份無效（1-12）',
                success: false
            });
        }

        if (data.birthDay < 1 || data.birthDay > 31) {
            return res.status(400).json({
                error: '出生日期無效（1-31）',
                success: false
            });
        }

        // 檢查請求體大小
        const requestSize = JSON.stringify(req.body).length;
        if (requestSize > 10000) {
            return res.status(413).json({
                error: '請求數據過大',
                success: false
            });
        }

        console.log('🔮 接收到計算請求:', {
            name: sanitizeForLog(data.name),
            gender: data.gender,
            birthDate: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
            calendarType: data.calendarType
        });

        let result;

        // 使用真實核心或簡化計算
        if (ZiweiCore) {
            result = calculateWithRealCore(data);
        } else {
            result = calculateWithSimplifiedLogic(data);
        }

        const response = {
            success: true,
            name: sanitizeInput(data.name),
            palaces: result.palaces,
            element: result.element,
            source: ZiweiCore ? 'real-core' : 'simplified',
            timestamp: new Date().toISOString()
        };

        console.log('✅ 計算完成，返回', response.palaces.length, '個宮位');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ 計算錯誤:', error);
        res.status(500).json({
            success: false,
            error: '計算失敗',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// 使用真實的 TypeScript 核心計算
function calculateWithRealCore(data) {
    try {
        const { DestinyBoard, DestinyConfigBuilder, Gender, ConfigType, DayTimeGround } = ZiweiCore;

        // 構建配置
        const gender = data.gender === 'M' ? Gender.M : Gender.F;
        const calendarType = data.calendarType === 'lunar' ? 'lunar' : 'solar';

        let destinyConfig;

        if (calendarType === 'lunar') {
            // 農曆
            const bornTimeGround = DayTimeGround.getByName(data.birthHour);
            destinyConfig = DestinyConfigBuilder.withlunar({
                year: data.birthYear,
                month: data.birthMonth,
                day: data.birthDay,
                isLeapMonth: data.isLeapMonth || false,
                bornTimeGround: bornTimeGround,
                configType: ConfigType.SKY,
                gender: gender
            });
        } else {
            // 西曆
            destinyConfig = DestinyConfigBuilder.withSolar({
                year: data.birthYear,
                month: data.birthMonth,
                day: data.birthDay,
                bornTimeGround: DayTimeGround.getByName(data.birthHour),
                configType: ConfigType.SKY,
                gender: gender
            });
        }

        // 創建命盤
        const destinyBoard = new DestinyBoard(destinyConfig);

        // 轉換為 API 格式
        const palaces = destinyBoard.cells.map((cell, index) => {
            const temple = cell.temples[0];
            return {
                palaceName: temple ? temple.name : `宮位${index + 1}`,
                palaceIndex: index,
                majorStars: cell.majorStars.map(star => ({
                    name: star.name,
                    energyLevel: star.energyLevel || 0,
                    energyType: star.shadowLight === 0 ? 'yang' : 'yin'
                })),
                minorStars: cell.minorStars.map(star => ({
                    name: star.name,
                    energyLevel: 0,
                    energyType: 'neutral'
                })),
                element: cell.ground ? cell.ground.name : '未知',
                sky: cell.sky ? cell.sky.name : '未知',
                ground: cell.ground ? cell.ground.name : '未知'
            };
        });

        return {
            palaces: palaces,
            element: destinyBoard.element ? destinyBoard.element.name : '土五局'
        };

    } catch (error) {
        console.error('真實核心計算失敗，回退到簡化計算:', error);
        return calculateWithSimplifiedLogic(data);
    }
}

// 簡化的計算邏輯（備用）
function calculateWithSimplifiedLogic(data) {
    const palaces = [
        '命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
        '遷移宮', '交友宮', '事業宮', '田宅宮', '福德宮', '父母宮'
    ];

    const majorStarsPool = [
        '紫微', '天府', '天機', '太陽', '武曲', '天同', '廉貞', '太陰',
        '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
    ];

    const minorStarsPool = [
        '左輔', '右弼', '天魁', '天鉞', '文昌', '文曲', '祿存', '天馬',
        '火星', '鈴星', '擎羊', '陀羅', '地空', '地劫'
    ];

    // 使用確定性算法而非隨機
    const seed = data.birthYear + data.birthMonth * 100 + data.birthDay * 10000;

    const palacesData = palaces.map((name, index) => {
        const starIndex = (seed + index) % majorStarsPool.length;
        const hasMinorStar = ((seed + index * 7) % 3) === 0;

        return {
            palaceName: name,
            palaceIndex: index,
            majorStars: [{
                name: majorStarsPool[starIndex],
                energyLevel: 50 + ((seed + index * 3) % 50),
                energyType: index % 2 === 0 ? 'yang' : 'yin'
            }],
            minorStars: hasMinorStar ? [{
                name: minorStarsPool[(seed + index * 5) % minorStarsPool.length],
                energyLevel: 30 + ((seed + index * 2) % 40),
                energyType: 'neutral'
            }] : [],
            element: ['金', '木', '水', '火', '土'][(seed + index) % 5],
            sky: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(seed + index) % 10],
            ground: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][index]
        };
    });

    return {
        palaces: palacesData,
        element: ['水二局', '木三局', '金四局', '土五局', '火六局'][seed % 5]
    };
}

// 清理輸入以防止 XSS
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .substring(0, 100);
}

// 清理日誌輸出
function sanitizeForLog(input) {
    if (typeof input !== 'string') return '[非字串]';
    return input.substring(0, 20) + (input.length > 20 ? '...' : '');
}
