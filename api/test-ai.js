/**
 * Vercel Serverless Function for Testing AI API
 * API Route: /api/test-ai
 */

module.exports = async function handler(req, res) {
    console.log('🔮 AI API 測試端點');
    
    // CORS 頭部
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const testData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            envCheck: {
                hasOpenAIKey: !!process.env.OPENAI_API_KEY,
                keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
            },
            userAgent: req.headers['user-agent'] || 'Unknown',
            url: req.url
        };

        res.status(200).json({
            success: true,
            message: 'AI API 測試端點正常運行',
            data: testData
        });

    } catch (error) {
        console.error('❌ AI API 測試失敗:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'AI API 測試失敗' 
        });
    }
};
