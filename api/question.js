/**
 * Vercel Serverless Function for Zi Wei Dou Shu Q&A System
 * API Route: /api/question
 * Model: GPT-4o with Thread Support (升級版)
 * Features: 連續對話、命盤自動帶入、Credit 後端管理
 */

// 簡單的內存存儲（生產環境應使用 Redis 或數據庫）
// Vercel Serverless 的限制：每次調用都是新的實例，所以這裡用簡化方案
const conversationStore = new Map();
const creditStore = new Map();

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數問答系統 API (GPT-4o + Thread)');

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-ID');

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

        // 記錄接收到的數據結構（不記錄敏感內容）
        console.log('📥 接收到問答請求:', {
            hasQuestion: !!data?.question,
            hasUserProfile: !!data?.userProfile,
            hasDestinyData: !!data?.destinyData,
            hasPalaces: !!(data?.destinyData?.palaces),
            palacesCount: data?.destinyData?.palaces?.length,
            questionLength: data?.question?.length
        });

        // 詳細的輸入驗證
        if (!data || typeof data !== 'object') {
            console.error('❌ 請求數據格式無效');
            return res.status(400).json({
                success: false,
                error: '請求數據格式無效'
            });
        }

        // 詳細檢查每個必要參數（與 analyze.js 保持一致）
        const missingParams = [];
        if (!data.question) missingParams.push('question');
        if (!data.userProfile) missingParams.push('userProfile');
        if (!data.destinyData) missingParams.push('destinyData');

        if (missingParams.length > 0) {
            console.error('❌ 缺少必要參數:', missingParams);
            return res.status(400).json({
                success: false,
                error: `缺少必要參數：${missingParams.join(', ')}`,
                missingParams: missingParams
            });
        }

        // 驗證 destinyData 結構（寬鬆檢查，與 analyze.js 一致）
        // 如果有 palaces 但為空數組，也允許通過（AI 會處理）
        if (data.destinyData.palaces !== undefined && !Array.isArray(data.destinyData.palaces)) {
            console.error('❌ destinyData.palaces 不是數組:', typeof data.destinyData.palaces);
            return res.status(400).json({
                success: false,
                error: '命盤數據格式錯誤'
            });
        }

        // 如果 destinyData 沒有 palaces 屬性，記錄警告但繼續（可能是舊格式）
        if (!data.destinyData.palaces) {
            console.warn('⚠️ destinyData 缺少 palaces 屬性，嘗試繼續處理');
            console.warn('⚠️ destinyData 結構:', Object.keys(data.destinyData));
        }

        // 驗證問題長度
        if (data.question.length > 500) {
            return res.status(400).json({
                success: false,
                error: '問題過長（最多 500 字）'
            });
        }

        // 獲取用戶 ID（從 header 或 body）
        const userId = req.headers['x-user-id'] || data.userId || 'anonymous';

        // 檢查 Credit（後端驗證）
        const creditCheck = await checkAndConsumeCredit(userId);
        if (!creditCheck.allowed) {
            return res.status(403).json({
                success: false,
                error: creditCheck.message,
                remainingCredits: creditCheck.remaining,
                needPayment: true
            });
        }

        // 檢查請求體大小
        const requestSize = JSON.stringify(req.body).length;
        if (requestSize > 50000) {
            return res.status(413).json({
                success: false,
                error: '請求數據過大'
            });
        }

        console.log('🔮 接收到問答請求，用戶ID:', userId.substring(0, 10) + '...');

        // 獲取 thread ID（如果是連續對話）
        const threadId = data.threadId || generateThreadId(userId);

        // 構建 ChatGPT 問答提示詞（包含歷史對話）
        const messages = buildQuestionMessages(
            data.question,
            data.userProfile,
            data.destinyData,
            threadId
        );

        // 調用 ChatGPT API (GPT-4o)
        const aiResponse = await callChatGPTForQuestion(messages);

        // 保存對話歷史
        saveConversationHistory(threadId, data.question, aiResponse);

        res.status(200).json({
            success: true,
            answer: aiResponse,
            threadId: threadId,  // 返回 thread ID 供下次使用
            remainingCredits: creditCheck.remaining - 1,
            model: 'gpt-4o',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ 問答失敗:', error);

        // 錯誤處理（不暴露內部錯誤）
        if (error.message.includes('OpenAI API key')) {
            return res.status(500).json({
                success: false,
                error: 'AI 服務配置錯誤，請聯繫管理員'
            });
        } else if (error.message.includes('rate_limit')) {
            return res.status(429).json({
                success: false,
                error: 'AI 服務使用量過高，請稍後再試'
            });
        } else if (error.message.includes('context_length')) {
            return res.status(400).json({
                success: false,
                error: '對話內容過長，請開始新的對話'
            });
        }

        res.status(500).json({
            success: false,
            error: '問答服務暫時無法使用'
        });
    }
};

// 檢查並消耗 Credit（後端驗證）
async function checkAndConsumeCredit(userId) {
    // 初始化用戶 credit
    if (!creditStore.has(userId)) {
        creditStore.set(userId, {
            credits: 3,
            lastReset: new Date(),
            paidUntil: null
        });
    }

    const userCredit = creditStore.get(userId);
    const now = new Date();

    // 檢查是否在付費期間
    if (userCredit.paidUntil && now < userCredit.paidUntil) {
        return {
            allowed: true,
            remaining: 999,  // 無限
            isPaid: true
        };
    }

    // 檢查是否需要重置（每月重置）
    const daysSinceReset = (now - userCredit.lastReset) / (1000 * 60 * 60 * 24);
    if (daysSinceReset >= 30) {
        userCredit.credits = 3;
        userCredit.lastReset = now;
    }

    // 檢查是否還有 credit
    if (userCredit.credits <= 0) {
        return {
            allowed: false,
            remaining: 0,
            message: '您的免費問答次數已用完，請升級為付費會員'
        };
    }

    // 消耗一個 credit
    userCredit.credits--;
    creditStore.set(userId, userCredit);

    return {
        allowed: true,
        remaining: userCredit.credits,
        isPaid: false
    };
}

// 生成 Thread ID
function generateThreadId(userId) {
    return `thread_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 構建問答消息（包含命盤信息和歷史對話）
function buildQuestionMessages(question, userProfile, destinyData, threadId) {
    const messages = [];

    // 系統消息（包含命盤信息）
    const systemMessage = buildSystemMessage(userProfile, destinyData);
    messages.push({
        role: 'system',
        content: systemMessage
    });

    // 加載歷史對話（最多保留最近 5 輪）
    const history = getConversationHistory(threadId);
    if (history && history.length > 0) {
        const recentHistory = history.slice(-5);  // 只保留最近 5 輪
        recentHistory.forEach(item => {
            messages.push({ role: 'user', content: item.question });
            messages.push({ role: 'assistant', content: item.answer });
        });
    }

    // 當前問題
    messages.push({
        role: 'user',
        content: sanitizeInput(question)
    });

    return messages;
}

// 構建系統消息（包含完整命盤）
function buildSystemMessage(userProfile, destinyData) {
    const name = sanitizeInput(userProfile.name);
    const gender = userProfile.gender === 'M' ? '男' : '女';

    // 構建宮位配置文字（容錯處理）
    let palacesText = '';
    if (destinyData.palaces && Array.isArray(destinyData.palaces) && destinyData.palaces.length > 0) {
        palacesText = destinyData.palaces.map((palace, index) => {
            const palaceNames = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮', '遷移宮', '交友宮', '事業宮', '田宅宮', '福德宮', '父母宮'];
            const palaceName = palace.palaceName || palaceNames[index] || `宮位${index + 1}`;

            let majorStars = '無主星';
            if (Array.isArray(palace.majorStars) && palace.majorStars.length > 0) {
                majorStars = palace.majorStars
                    .map(star => sanitizeInput(star.name || star))
                    .join('、');
            } else if (typeof palace.majorStars === 'string') {
                majorStars = sanitizeInput(palace.majorStars);
            }

            return `${palaceName}: ${majorStars}`;
        }).join('\n');
    } else {
        palacesText = '（命盤數據正在載入中，請根據用戶的基本資料提供一般性建議）';
    }

    return `你是一位專業的紫微斗數命理師，遵循中州派傳統理論。你正在為以下用戶提供命理諮詢：

【用戶命盤資料】
姓名：${name}
性別：${gender}
出生日期：${userProfile.birthYear}年${userProfile.birthMonth}月${userProfile.birthDay}日
出生時辰：${userProfile.birthHour}
曆法類型：${userProfile.calendarType === 'lunar' ? '農曆' : '西曆'}

【十二宮位星曜配置】
${palacesText}

請注意：
1. 所有回答必須基於此命盤的星曜配置
2. 保持專業且正面積極的態度
3. 回答簡潔有力，控制在 300 字以內
4. 提供具體且實用的建議
5. 使用繁體中文回答
6. 這是連續對話，請記住之前的問答內容

現在請回答用戶的問題：`;
}

// 調用 ChatGPT API 進行問答 (GPT-4o)
async function callChatGPTForQuestion(messages) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OpenAI API key 未配置，請設置 OPENAI_API_KEY 環境變數');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',  // 升級為 GPT-4o
            messages: messages,
            max_tokens: 800,  // 控制回答長度
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

// 保存對話歷史
function saveConversationHistory(threadId, question, answer) {
    if (!conversationStore.has(threadId)) {
        conversationStore.set(threadId, []);
    }

    const history = conversationStore.get(threadId);
    history.push({
        question: question,
        answer: answer,
        timestamp: new Date().toISOString()
    });

    // 限制歷史記錄數量（最多 10 輪）
    if (history.length > 10) {
        history.shift();
    }

    conversationStore.set(threadId, history);

    // 清理過期對話（超過 1 小時）
    cleanupOldConversations();
}

// 獲取對話歷史
function getConversationHistory(threadId) {
    return conversationStore.get(threadId) || [];
}

// 清理過期對話
function cleanupOldConversations() {
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    for (const [threadId, history] of conversationStore.entries()) {
        if (history.length > 0) {
            const lastTimestamp = new Date(history[history.length - 1].timestamp);
            if (lastTimestamp < oneHourAgo) {
                conversationStore.delete(threadId);
            }
        }
    }
}

// 清理輸入以防止 XSS（基本版本）
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .substring(0, 500);
}
