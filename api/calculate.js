/**
 * Vercel Serverless Function for Zi Wei Dou Shu Calculation
 * API Route: /api/calculate
 */

module.exports = async function handler(req, res) {
    console.log('🔮 紫微斗數計算 API - 模擬模式');
    
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
        
        // 驗證輸入
        if (!data.name || !data.gender || !data.birthYear || !data.birthMonth || !data.birthDay || !data.birthHour) {
            res.status(400).json({ 
                error: '請填寫完整資料',
                required: ['name', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'birthHour']
            });
            return;
        }

        console.log('🔮 接收到計算請求:', data);

        // 模擬紫微斗數計算
        const palaces = [
            '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
            '遷移', '交友', '事業', '田宅', '福德', '父母'
        ];

        const majorStarsPool = [
            '紫微', '天府', '天機', '太陽', '武曲', '天同', '廉貞', '太陰',
            '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
        ];

        const minorStarsPool = [
            '左輔', '右弼', '天魁', '天鉞', '文昌', '文曲', '祿存', '天馬',
            '火星', '鈴星', '擎羊', '陀羅', '地空', '地劫'
        ];

        const palacesData = palaces.map((name, index) => ({
            palaceName: name,
            majorStars: Math.random() > 0.1 ? [{
                name: majorStarsPool[(data.birthYear + index) % majorStarsPool.length],
                energyLevel: 60 + Math.floor(Math.random() * 40),
                energyType: index % 2 === 0 ? 'yang' : 'yin'
            }] : [],
            minorStars: Math.random() > 0.5 ? [{
                name: minorStarsPool[Math.floor(Math.random() * minorStarsPool.length)],
                energyLevel: 30 + Math.floor(Math.random() * 40),
                energyType: 'neutral'
            }] : [],
            element: ['金', '木', '水', '火', '土'][(data.birthYear + index) % 5],
            ageRange: `年齡範圍 ${index * 10 + 1}-${(index + 1) * 10}`
        }));

        const response = {
            success: true,
            name: data.name,
            palaces: palacesData,
            source: 'simulation',
            timestamp: new Date().toISOString()
        };

        console.log('✅ 計算完成，返回', response.palaces.length, '個宮位');
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ 計算錯誤:', error);
        res.status(500).json({ 
            error: '計算失敗',
            details: error.message 
        });
    }
}