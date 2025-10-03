/**
 * Vercel Serverless Function for Zi Wei Dou Shu AI Analysis
 * API Route: /api/analyze
 */

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數 AI 分析 API');
    
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
        console.log('🔮 接收到 AI 分析請求');

        // 構建 ChatGPT 分析提示詞
        const analysisPrompt = buildAnalysisPrompt(data);
        
        // 調用 ChatGPT API
        const aiResponse = await callChatGPT(analysisPrompt);
        
        res.status(200).json({
            success: true,
            analysis: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI 分析失敗:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'AI 分析服務暫時無法使用' 
        });
    }
};

// 構建分析提示詞
function buildAnalysisPrompt(data) {
    const { userProfile, destinyData } = data;
    
    return `你是一位專業的紫微斗數命理師，請根據以下命盤資料進行詳細分析：

【個人基本資料】
姓名：${userProfile.name}
性別：${userProfile.gender === 'M' ? '男' : '女'}
出生日期：${userProfile.birthYear}年${userProfile.birthMonth}月${userProfile.birthDay}日
出生時辰：${userProfile.birthHour}
曆法類型：${userProfile.calendarType === 'lunar' ? '農曆' : '西曆'}
是否閏月：${userProfile.isLeapMonth ? '是' : '否'}

【十二宮位星曜配置】
${destinyData.palaces.map((palace, index) => {
    const palaceNames = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '事業', '田宅', '福德', '父母'];
    const majorStars = Array.isArray(palace.majorStars) 
        ? palace.majorStars.map(star => star.name || star).join('、')
        : palace.majorStars || '無主星';
    return `${palaceNames[index]}: ${majorStars}`;
}).join('\n')}

請提供以下四個部分的詳細分析：

1. 【主星亮度與吉凶分析】
   - 分析各宮位主星的亮度強弱
   - 統計吉星和凶星的分佈
   - 計算吉凶指數

2. 【格局分析】
   - 識別重要的格局組合
   - 分析格局的吉凶性質
   - 說明格局對命運的影響

3. 【本命：命宮之各星說明】
   - 詳細解釋命宮中每個星曜的含義
   - 分析星曜之間的相互作用
   - 說明對個性的影響

4. 【總結】
   - 用適合12歲小朋友理解的白話文解釋其命格特質
   - 保持正面積極的態度
   - 提供人生建議和鼓勵

請用繁體中文回答，內容要專業且易懂，保持正面積極的態度。`;
}

// 調用 ChatGPT API
async function callChatGPT(prompt) {
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
                    content: '你是一位專業的紫微斗數命理師，具有豐富的命理分析經驗，能夠提供準確且正面的命理解析。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`ChatGPT API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
