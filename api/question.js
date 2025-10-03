/**
 * Vercel Serverless Function for Zi Wei Dou Shu Q&A System
 * API Route: /api/question
 */

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數問答系統 API');
    
    // CORS 頭部
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const data = req.body;
        console.log('🔮 接收到問答請求');

        // 驗證必要數據
        if (!data.question || !data.userProfile || !data.destinyData) {
            return res.status(400).json({
                success: false,
                error: '缺少必要參數：question, userProfile, destinyData'
            });
        }

        // 構建 ChatGPT 問答提示詞
        const questionPrompt = buildQuestionPrompt(data.question, data.userProfile, data.destinyData);
        
        // 調用 ChatGPT API
        const aiResponse = await callChatGPTForQuestion(questionPrompt);
        
        res.status(200).json({
            success: true,
            answer: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ 問答失敗:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || '問答服務暫時無法使用' 
        });
    }
};

// 構建問答提示詞
function buildQuestionPrompt(question, userProfile, destinyData) {
    return `你是一位專業的紫微斗數命理師，請根據以下命盤資料回答用戶的具體問題。

【用戶問題】
${question}

【個人基本資料】
姓名：${userProfile.name}
性別：${userProfile.gender === 'M' ? '男' : '女'}
出生日期：${userProfile.birthYear}年${userProfile.birthMonth}月${userProfile.birthDay}日
出生時辰：${userProfile.birthHour}
曆法類型：${userProfile.calendarType === 'lunar' ? '農曆' : '西曆'}

【十二宮位星曜配置】
${destinyData.palaces.map((palace, index) => {
    const palaceNames = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '事業', '田宅', '福德', '父母'];
    const majorStars<｜tool▁call▁begin｜>
Array.isArray(palace.majorStars) 
        ? palace.majorStars.map(star => star.name || star).join('、')
        : palace.majorStars || '無主星';
    return `${palaceNames[index]}: ${majorStars}`;
}).join('\n')}

請注意以下要求：
1. 回答必須基於此命盤的星曜配置
2. 保持專業且正面積極的態度
3. 回答長度控制在300字以內
4. 提供具體且實用的建議
5. 使用繁體中文回答

請針對用戶的問題給出詳細分析：`;
}

// 調用 ChatGPT API 進行問答
async function callChatGPTForQuestion(prompt) {
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
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: '你是一位專業的紫微斗數命理師，具有豐富的命理分析經驗，能夠根據命盤提供準確且實用的建議。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`ChatGPT API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
