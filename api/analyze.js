/**
 * Vercel Serverless Function for Zi Wei Dou Shu AI Analysis
 * API Route: /api/analyze
 * Model: GPT-4o (升級版)
 * 支援多語言 (zh-TW, en)
 */

const { setCorsHeaders, handleOptions } = require('../lib/cors');
const { sendError, t } = require('../lib/errors');
const { detectLocale } = require('../lib/i18n-server');

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數 AI 分析 API (GPT-4o)');

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

        if (!data.userProfile || !data.destinyData) {
            const message = t(locale, 'api.validation.missingParams', { fields: 'userProfile, destinyData' })
                || '缺少必要參數：userProfile 和 destinyData';
            return res.status(400).json({
                success: false,
                error: 'MISSING_PARAMETERS',
                message: message,
                locale: locale
            });
        }

        // 驗證 userProfile
        const { userProfile, destinyData } = data;
        if (!userProfile.name || !userProfile.gender ||
            !userProfile.birthYear || !userProfile.birthMonth ||
            !userProfile.birthDay || !userProfile.birthHour) {
            const message = locale === 'en'
                ? 'Incomplete user profile data'
                : '用戶資料不完整';
            return res.status(400).json({
                success: false,
                error: 'INVALID_PARAMETERS',
                message: message,
                locale: locale
            });
        }

        // 驗證數據類型和範圍
        if (!['M', 'F'].includes(userProfile.gender)) {
            const message = t(locale, 'api.validation.invalidGender') || '性別必須是 M 或 F';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        if (userProfile.birthYear < 1900 || userProfile.birthYear > 2100) {
            const message = t(locale, 'api.validation.invalidYear') || '出生年份無效（1900-2100）';
            return sendError(res, 'INVALID_PARAMETERS', message, {}, locale);
        }

        // 檢查請求體大小
        const requestSize = JSON.stringify(req.body).length;
        if (requestSize > 50000) {
            return sendError(res, 'PAYLOAD_TOO_LARGE', null, {}, locale);
        }

        console.log('🔮 接收到 AI 分析請求，用戶:', sanitizeForLog(userProfile.name));

        // 構建 ChatGPT 分析提示詞 (根據語言選擇)
        const analysisPrompt = buildAnalysisPrompt(data, locale);

        // 調用 ChatGPT API (GPT-4o)
        const aiResponse = await callChatGPT(analysisPrompt, locale);

        res.status(200).json({
            success: true,
            analysis: aiResponse,
            model: 'gpt-4o',
            locale: locale,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI 分析失敗:', error);

        // 詳細的錯誤日誌（但不暴露給客戶端）
        if (error.message.includes('OpenAI API key')) {
            console.error('❌ OpenAI API Key 未配置');
            return sendError(res, 'CONFIGURATION_ERROR', null, {}, locale);
        } else if (error.message.includes('rate_limit')) {
            console.error('❌ OpenAI API 超過限制');
            return sendError(res, 'RATE_LIMIT_EXCEEDED', null, {}, locale);
        } else if (error.message.includes('connect') || error.message.includes('fetch')) {
            console.error('❌ OpenAI API 連接失敗');
            return sendError(res, 'SERVICE_UNAVAILABLE', null, {}, locale);
        }

        return sendError(res, 'ANALYSIS_FAILED', null, {}, locale);
    }
};

// 構建分析提示詞 (支援多語言)
function buildAnalysisPrompt(data, locale = 'zh-TW') {
    if (locale === 'en') {
        return buildEnglishPrompt(data);
    } else {
        return buildChinesePrompt(data);
    }
}

// 中文提示詞
function buildChinesePrompt(data) {
    const { userProfile, destinyData } = data;

    // 清理和轉義用戶輸入
    const name = sanitizeInput(userProfile.name);
    const gender = userProfile.gender === 'M' ? '男' : '女';

    return `你是一位專業的紫微斗數命理師，請根據以下命盤資料進行詳細分析：

【個人基本資料】
姓名：${name}
性別：${gender}
出生日期：${userProfile.birthYear}年${userProfile.birthMonth}月${userProfile.birthDay}日
出生時辰：${userProfile.birthHour}
曆法類型：${userProfile.calendarType === 'lunar' ? '農曆' : '西曆'}
是否閏月：${userProfile.isLeapMonth ? '是' : '否'}

【十二宮位星曜配置】
${destinyData.palaces.map((palace, index) => {
        const palaceNames = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '事業', '田宅', '福德', '父母'];
        const majorStars = Array.isArray(palace.majorStars)
            ? palace.majorStars.map(star => sanitizeInput(star.name || star)).join('、')
            : palace.majorStars || '無主星';
        return `${palaceNames[index]}: ${majorStars}`;
    }).join('\n')}

請提供以下四個部分的詳細分析：

### 主星亮度與吉凶分析
分析各宮位主星的亮度強弱、統計吉星和凶星的分佈、計算吉凶指數

### 格局分析
識別重要的格局組合、分析格局的吉凶性質、說明格局對命運的影響

### 本命：命宮之各星說明
詳細解釋命宮中每個星曜的含義、分析星曜之間的相互作用、說明對個性的影響

### 總結
用連12歲小朋友都能理解的白話文解釋其命格特質，保持正面積極的態度，提供人生建議和鼓勵

請用繁體中文回答，稱呼使用者時，應注意其年齡與性別，以提供正確的稱謂，內容要專業且易懂，保持正面積極的態度。使用 ### 標題格式來分隔各個部分。`;
}

// 英文提示詞
function buildEnglishPrompt(data) {
    const { userProfile, destinyData } = data;

    // 清理和轉義用戶輸入
    const name = sanitizeInput(userProfile.name);
    const gender = userProfile.gender === 'M' ? 'Male' : 'Female';

    // 宮位名稱 (英文，附帶中文原文)
    const palaceNamesEn = [
        'Life Palace (命宮)',
        'Siblings Palace (兄弟宮)',
        'Spouse Palace (夫妻宮)',
        'Children Palace (子女宮)',
        'Wealth Palace (財帛宮)',
        'Health Palace (疾厄宮)',
        'Travel Palace (遷移宮)',
        'Friends Palace (交友宮)',
        'Career Palace (事業宮)',
        'Property Palace (田宅宮)',
        'Fortune Palace (福德宮)',
        'Parents Palace (父母宮)'
    ];

    return `You are a professional Zi Wei Dou Shu (Purple Star Astrology) consultant. Please provide a detailed destiny chart analysis based on the following information:

【Personal Information】
Name: ${name}
Gender: ${gender}
Date of Birth: ${userProfile.birthMonth}/${userProfile.birthDay}/${userProfile.birthYear}
Birth Hour: ${userProfile.birthHour}
Calendar Type: ${userProfile.calendarType === 'lunar' ? 'Lunar' : 'Solar'}
Leap Month: ${userProfile.isLeapMonth ? 'Yes' : 'No'}

【Twelve Palaces Star Configuration】
${destinyData.palaces.map((palace, index) => {
        const majorStars = Array.isArray(palace.majorStars)
            ? palace.majorStars.map(star => sanitizeInput(star.name || star)).join(', ')
            : palace.majorStars || 'No Major Star';
        return `${palaceNamesEn[index]}: ${majorStars}`;
    }).join('\n')}

Please provide a comprehensive analysis covering the following four sections:

### Star Brightness and Fortune Analysis
Analyze the brightness and strength of major stars in each palace, assess the distribution of auspicious and inauspicious stars, and calculate the fortune index.

### Pattern Analysis
Identify important star pattern combinations, analyze the auspicious or inauspicious nature of these patterns, and explain their influence on destiny.

### Life Palace: Detailed Star Interpretation
Provide detailed explanations of each star in the Life Palace (命宮), analyze the interactions between stars, and explain their influence on personality traits.

### Summary
Explain the destiny chart characteristics in simple, accessible language that even a 12-year-old could understand. Maintain a positive and encouraging tone, providing life advice and encouragement.

Please respond in English, use appropriate forms of address considering the user's age and gender, keep the content professional yet easy to understand, and maintain a positive and encouraging attitude. Use ### heading format to separate each section. Include Chinese terminology in parentheses for authenticity (e.g., "Purple Star (紫微)", "Life Palace (命宮)").`;
}

// 調用 ChatGPT API (GPT-4o) - 支援多語言
async function callChatGPT(prompt, locale = 'zh-TW') {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OpenAI API key 未配置，請設置 OPENAI_API_KEY 環境變數');
    }

    // 根據語言選擇系統提示詞
    const systemMessage = locale === 'en'
        ? 'You are a professional Zi Wei Dou Shu (Purple Star Astrology) consultant, following the Zhongzhou school traditional theory. You have extensive experience in destiny chart analysis and can provide accurate and positive interpretations. Your responses should be professional, easy to understand, and maintain a positive and encouraging attitude.'
        : '你是一位專業的紫微斗數命理師，遵循中州派傳統理論，具有豐富的命理分析經驗，能夠提供準確且正面的命理解析。你的回答要專業、易懂、正面積極。';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',  // 升級為 GPT-4o
            messages: [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 3000,  // GPT-4o 可以處理更多 tokens
            temperature: 0.7,
            top_p: 0.9
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API 錯誤:', errorData);
        throw new Error(`ChatGPT API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 驗證回應格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('AI 回應格式無效');
    }

    return data.choices[0].message.content;
}

// 清理輸入以防止 XSS（基本版本）
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '')  // 移除 HTML 標籤
        .replace(/javascript:/gi, '')  // 移除 javascript: 協議
        .substring(0, 100);  // 限制長度
}

// 清理日誌輸出
function sanitizeForLog(input) {
    if (typeof input !== 'string') return '[非字串]';
    return input.substring(0, 20) + (input.length > 20 ? '...' : '');
}
