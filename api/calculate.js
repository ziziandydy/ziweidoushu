/**
 * Vercel Serverless Function for Zi Wei Dou Shu Calculation
 * API Route: /api/calculate
 * 整合真實的 TypeScript 核心計算引擎
 */

const { setCorsHeaders, handleOptions } = require('../lib/cors');
const { sendError, validateRequired, t } = require('../lib/errors');
const { detectLocale } = require('../lib/i18n-server');

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

    // 設定 CORS
    setCorsHeaders(req, res);
    if (handleOptions(req, res)) return;

    // 偵測語言
    const locale = detectLocale(req);
    console.log('🌐 Locale detected:', locale);

    if (req.method !== 'POST') {
        return sendError(res, 'METHOD_NOT_ALLOWED', null, {}, locale);
    }

    try {
        const data = req.body;

        // 詳細的輸入驗證
        if (!data || typeof data !== 'object') {
            return sendError(res, 'INVALID_REQUEST', null, {}, locale);
        }

        // 驗證必填欄位
        const requiredFields = ['name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'birthHour'];
        const validationError = validateRequired(data, requiredFields, locale);
        if (validationError) {
            return res.status(400).json(validationError);
        }

        // 驗證數據類型和範圍
        if (!['M', 'F'].includes(data.gender)) {
            const message = t(locale, 'api.validation.invalidGender') || '性別必須是 M 或 F';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        if (data.birthYear < 1900 || data.birthYear > 2100) {
            const message = t(locale, 'api.validation.invalidYear') || '出生年份無效（1900-2100）';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        if (data.birthMonth < 1 || data.birthMonth > 12) {
            const message = t(locale, 'api.validation.invalidMonth') || '出生月份無效（1-12）';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        if (data.birthDay < 1 || data.birthDay > 31) {
            const message = t(locale, 'api.validation.invalidDay') || '出生日期無效（1-31）';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        // 檢查請求體大小
        const requestSize = JSON.stringify(req.body).length;
        if (requestSize > 10000) {
            return sendError(res, 'PAYLOAD_TOO_LARGE', null, {}, locale);
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
            destinyMaster: result.destinyMaster || null,
            bodyMaster: result.bodyMaster || null,
            source: ZiweiCore ? 'real-core' : 'simplified',
            locale: locale,
            timestamp: new Date().toISOString()
        };

        console.log('✅ 計算完成，返回', response.palaces.length, '個宮位');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ 計算錯誤:', error);
        return sendError(res, 'CALCULATION_FAILED', null, {}, locale);
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

        // 引擎的 cells 依地支排列，宮名（命宮除外）不帶「宮」字；
        // 這裡正規化成前端使用的宮位順序索引與完整宮名
        const PALACE_ORDER = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
            '遷移宮', '交友宮', '事業宮', '田宅宮', '福德宮', '父母宮'];
        const normalizeTempleName = (name) => name.endsWith('宮') ? name : `${name}宮`;

        const palaces = destinyBoard.cells.map((cell, cellIndex) => {
            const templeNames = cell.temples.map(t => normalizeTempleName(t.displayName));
            const mainTemple = templeNames.find(n => n !== '身宮') || `宮位${cellIndex + 1}`;
            const orderIndex = PALACE_ORDER.indexOf(mainTemple);
            return {
                palaceName: mainTemple,
                palaceIndex: orderIndex >= 0 ? orderIndex : cellIndex,
                isBodyPalace: templeNames.includes('身宮'),
                majorStars: cell.majorStars.map(star => ({
                    name: star.displayName,
                    // 廟旺平陷等級：-1（陷）到 2（廟）
                    energyLevel: destinyBoard.getMajorStarEnergyLevel(star),
                    energyType: 'major'
                })),
                minorStars: cell.minorStars.map(star => ({
                    name: star.displayName,
                    energyLevel: 0,
                    energyType: 'neutral'
                })),
                element: cell.ground ? cell.ground.displayName : '未知',
                sky: cell.sky ? cell.sky.displayName : '未知',
                ground: cell.ground ? cell.ground.displayName : '未知'
            };
        });

        // 依宮位順序排序（引擎原始順序是地支），讓下游以陣列順序取用時也正確
        palaces.sort((a, b) => a.palaceIndex - b.palaceIndex);

        return {
            palaces: palaces,
            element: destinyBoard.element ? destinyBoard.element.displayName : '土五局',
            destinyMaster: destinyBoard.destinyMaster ? destinyBoard.destinyMaster.displayName : null,
            bodyMaster: destinyBoard.bodyMaster ? destinyBoard.bodyMaster.displayName : null
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
